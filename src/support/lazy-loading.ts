import type { Directive } from 'vue';
import router from '@/router';

const isBrowser = typeof window !== 'undefined';
const hasIntersectionObserver = isBrowser && 'IntersectionObserver' in window;
const prefetchedRoutes = new Set<string>();

const idleCallback =
        isBrowser && 'requestIdleCallback' in window
                ? (window as typeof window & {
                                requestIdleCallback: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
                        }).requestIdleCallback.bind(window)
                : null;

const cancelIdleCallback =
        isBrowser && 'cancelIdleCallback' in window
                ? (window as typeof window & { cancelIdleCallback: (handle: number) => void }).cancelIdleCallback.bind(window)
                : null;

type Cleanup = () => void;

interface LinkState {
        cleanup: Cleanup;
        href: string | null;
}

const linkStates = new WeakMap<HTMLAnchorElement, LinkState>();

function normaliseHref(element: HTMLAnchorElement): string | null {
        const rawHref = element.getAttribute('href');

        if (!rawHref) {
                return null;
        }

        const trimmed = rawHref.trim();

        if (
                trimmed === '' ||
                trimmed.startsWith('#') ||
                trimmed.startsWith('mailto:') ||
                trimmed.startsWith('tel:') ||
                trimmed.startsWith('javascript:')
        ) {
                return null;
        }

        if (!isBrowser) {
                return trimmed;
        }

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

function prefetchRoute(href: string): void {
        if (!isBrowser) {
                return;
        }

        if (prefetchedRoutes.has(href)) {
                return;
        }

        try {
                const resolved = router.resolve(href);

                resolved.matched.forEach((record) => {
                        const components = record.components ?? (record.component ? { default: record.component } : undefined);

                        if (!components) {
                                return;
                        }

                        Object.values(components).forEach((component) => {
                                if (typeof component === 'function') {
                                        // Trigger the dynamic import for the route component
                                        void component();
                                }
                        });
                });

                prefetchedRoutes.add(href);
        } catch (error) {
                console.error('Unable to prefetch route component for link', href, error);
        }
}

function createLazyLinkCleanup(element: HTMLAnchorElement, href: string | null): Cleanup {
        if (!href) {
                element.dataset.lazyLink = 'ignored';

                return () => {
                        delete element.dataset.lazyLink;
                };
        }

        element.dataset.lazyLink = 'observed';

        let idleHandle: number | null = null;

        const schedulePrefetch = (): void => {
                if (!isBrowser || prefetchedRoutes.has(href)) {
                        return;
                }

                const runPrefetch = () => {
                        idleHandle = null;
                        prefetchRoute(href);
                        element.dataset.lazyLink = 'prefetched';
                };

                if (idleCallback) {
                        idleHandle = idleCallback(() => {
                                runPrefetch();
                        }, { timeout: 1500 });
                } else {
                        idleHandle = window.setTimeout(() => {
                                runPrefetch();
                        }, 120);
                }
        };

        const cleanupFns: Cleanup[] = [];

        if (hasIntersectionObserver) {
                        const observer = new IntersectionObserver((entries, currentObserver) => {
                                entries.forEach((entry) => {
                                        if (entry.isIntersecting) {
                                                schedulePrefetch();
                                                currentObserver.unobserve(entry.target);
                                        }
                                });
                        }, { rootMargin: '160px' });

                        observer.observe(element);
                        cleanupFns.push(() => {
                                currentObserverCleanup(observer, element);
                        });
        } else {
                // As a fallback, trigger prefetch on mount once the browser is idle
                schedulePrefetch();
        }

        const pointerHandler = () => schedulePrefetch();
        const focusHandler = () => schedulePrefetch();
        const touchHandler = () => schedulePrefetch();

        element.addEventListener('pointerenter', pointerHandler, { once: true });
        element.addEventListener('focus', focusHandler, { once: true });
        element.addEventListener('touchstart', touchHandler, { once: true, passive: true });

        cleanupFns.push(() => {
                element.removeEventListener('pointerenter', pointerHandler);
                element.removeEventListener('focus', focusHandler);
                element.removeEventListener('touchstart', touchHandler);
        });

        cleanupFns.push(() => {
                if (idleHandle !== null) {
                        if (cancelIdleCallback) {
                                cancelIdleCallback(idleHandle);
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

function currentObserverCleanup(observer: IntersectionObserver, element: HTMLAnchorElement): void {
        try {
                observer.unobserve(element);
        } catch (error) {
                console.error('Failed to disconnect lazy link observer', error);
        }

        observer.disconnect();
}

export const lazyLinkDirective: Directive<HTMLAnchorElement, undefined> = {
        mounted(element) {
                if (!isBrowser) {
                        return;
                }

                const href = normaliseHref(element);
                const cleanup = createLazyLinkCleanup(element, href);

                linkStates.set(element, { cleanup, href });
        },
        updated(element) {
                if (!isBrowser) {
                        return;
                }

                const currentState = linkStates.get(element);
                const href = normaliseHref(element);

                if (currentState && currentState.href === href) {
                        return;
                }

                currentState?.cleanup();

                const cleanup = createLazyLinkCleanup(element, href);

                linkStates.set(element, { cleanup, href });
        },
        unmounted(element) {
                if (!isBrowser) {
                        return;
                }

                const state = linkStates.get(element);
                state?.cleanup();
                linkStates.delete(element);
        },
};
