const isBrowser = typeof window !== 'undefined';
const noop = () => {};

type IdleWindow = Window &
	typeof globalThis & {
		requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
		cancelIdleCallback?: (handle: number) => void;
	};

export type DeferredCleanup = () => void;

export function runAfterLoad(task: () => void): DeferredCleanup {
	if (!isBrowser) {
		return noop;
	}

	if (document.readyState === 'complete') {
		const handle = window.setTimeout(task, 0);

		return () => window.clearTimeout(handle);
	}

	const onLoad = () => {
		task();
	};

	window.addEventListener('load', onLoad, { once: true });

	return () => {
		window.removeEventListener('load', onLoad);
	};
}

export function runWhenIdle(task: () => void, timeout = 1500): DeferredCleanup {
	if (!isBrowser) {
		return noop;
	}

	const idleWin = window as IdleWindow;

	if (typeof idleWin.requestIdleCallback === 'function') {
		const handle = idleWin.requestIdleCallback(task, { timeout });

		return () => {
			idleWin.cancelIdleCallback?.(handle);
		};
	}

	const handle = window.setTimeout(task, 120);

	return () => window.clearTimeout(handle);
}

export function runAfterLoadAndIdle(task: () => void, timeout = 1500): DeferredCleanup {
	let cancelId: DeferredCleanup = noop;

	const cancelLd = runAfterLoad(() => {
		cancelId = runWhenIdle(task, timeout);
	});

	return () => {
		cancelLd();
		cancelId();
	};
}
