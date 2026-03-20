import router from '@/router';
import type { Directive } from 'vue';

const prefRts = new Set<string>();
const isBrowser = typeof window !== 'undefined';
const hasIntOb = isBrowser && 'IntersectionObserver' in window;

const idleCall =
	isBrowser && 'requestIdleCallback' in window
		? (
				window as typeof window & {
					requestIdleCallback: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
				}
			).requestIdleCallback.bind(window)
		: null;

const cancelCb = isBrowser && 'cancelIdleCallback' in window ? (window as typeof window & { cancelIdleCallback: (handle: number) => void }).cancelIdleCallback.bind(window) : null;

type Cleanup = () => void;

interface LinkState {
	cleanup: Cleanup;
	href: string | null;
}

const linkMap = new WeakMap<HTMLAnchorElement, LinkState>();

function normaliseHref(element: HTMLAnchorElement): string | null {
	const rawHref = element.getAttribute('href');

	if (!rawHref) {
		return null;
	}

	const trimmed = rawHref.trim();

	if (trimmed === '' || trimmed.startsWith('#') || trimmed.startsWith('mailto:') || trimmed.startsWith('tel:') || trimmed.startsWith('javascript:')) {
		return null;
	}

	if (isBrowser) {
		try {
			const parsed = new URL(trimmed, window.location.origin);

			if (parsed.origin !== window.location.origin) {
				return null;
			}

			return `${parsed.pathname}${parsed.search}${parsed.hash}`;
		} catch (error) {
			console.warn('Failed to parse link href for lazy loading', error);
			return null;
		}
	}

	// Outside a browser context we cannot reliably determine the current origin, so
	// avoid prefetching absolute URLs altogether. This mirrors the browser guard above
	// that only permits same-origin routes.
	if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)) {
		try {
			const parsed = new URL(trimmed);

			if (parsed.origin && parsed.origin !== 'null') {
				return null;
			}
		} catch (error) {
			console.warn('Failed to parse absolute link href for lazy loading', error);
			return null;
		}
	}

	return trimmed;
}

function prefetchRoute(href: string): void {
	if (!isBrowser) {
		return;
	}

	if (prefRts.has(href)) {
		return;
	}

	try {
		const resolved = router.resolve(href);

		resolved.matched.forEach((record) => {
			const components = record.components;

			if (!components) {
				return;
			}

			Object.values(components).forEach((component) => {
				if (typeof component === 'function') {
					// Trigger the dynamic import for the route component
					void (component as Function)();
				}
			});
		});

		prefRts.add(href);
	} catch (error) {
		console.error('Unable to prefetch route component for link', href, error);
	}
}

function makeCln(element: HTMLAnchorElement, href: string | null): Cleanup {
	if (!href) {
		element.dataset.lazyLink = 'ignored';

		return () => {
			delete element.dataset.lazyLink;
		};
	}

	element.dataset.lazyLink = 'observed';

	let idleHandle: number | null = null;

	const queuePref = (): void => {
		if (!isBrowser || prefRts.has(href)) {
			return;
		}

		const runPref = () => {
			idleHandle = null;
			prefetchRoute(href);
			element.dataset.lazyLink = 'prefetched';
		};

		if (idleCall) {
			idleHandle = idleCall(
				() => {
					runPref();
				},
				{ timeout: 1500 },
			);
		} else {
			idleHandle = window.setTimeout(() => {
				runPref();
			}, 120);
		}
	};

	const cleanupFns: Cleanup[] = [];

	if (hasIntOb) {
		const observer = new IntersectionObserver(
			(entries, currentObserver) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						queuePref();
						currentObserver.unobserve(entry.target);
					}
				});
			},
			{ rootMargin: '160px' },
		);

		observer.observe(element);
		cleanupFns.push(() => {
			clearObs(observer, element);
		});
	} else {
		// As a fallback, trigger prefetch on mount once the browser is idle
		queuePref();
	}

	const ptrHover = () => queuePref();
	const onFocus = () => queuePref();
	const onTouch = () => queuePref();

	element.addEventListener('pointerenter', ptrHover, { once: true });
	element.addEventListener('focus', onFocus, { once: true });
	element.addEventListener('touchstart', onTouch, { once: true, passive: true });

	cleanupFns.push(() => {
		element.removeEventListener('pointerenter', ptrHover);
		element.removeEventListener('focus', onFocus);
		element.removeEventListener('touchstart', onTouch);
	});

	cleanupFns.push(() => {
		if (idleHandle !== null) {
			if (cancelCb) {
				cancelCb(idleHandle);
			} else {
				window.clearTimeout(idleHandle);
			}

			idleHandle = null;
		}
	});

	return () => {
		cleanupFns.forEach((fn) => {
			try {
				fn();
			} catch (error) {
				console.error('Failed to cleanup lazy link handler', error);
			}
		});

		delete element.dataset.lazyLink;
	};
}

function clearObs(observer: IntersectionObserver, element: HTMLAnchorElement): void {
	try {
		observer.unobserve(element);
	} catch (error) {
		console.error('Failed to disconnect lazy link observer', error);
	}

	observer.disconnect();
}

export const lazyLink: Directive<HTMLAnchorElement, undefined> = {
	mounted(element) {
		if (!isBrowser) {
			return;
		}

		const href = normaliseHref(element);
		const cleanup = makeCln(element, href);

		linkMap.set(element, { cleanup, href });
	},
	updated(element) {
		if (!isBrowser) {
			return;
		}

		const curState = linkMap.get(element);
		const href = normaliseHref(element);

		if (curState && curState.href === href) {
			return;
		}

		curState?.cleanup();

		const cleanup = makeCln(element, href);

		linkMap.set(element, { cleanup, href });
	},
	unmounted(element) {
		if (!isBrowser) {
			return;
		}

		const state = linkMap.get(element);
		state?.cleanup();
		linkMap.delete(element);
	},
};

export const lazyLinkDirective = lazyLink;
