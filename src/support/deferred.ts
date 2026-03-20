const isBrowser = typeof window !== 'undefined';

type IdleWindow = Window &
	typeof globalThis & {
		requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
		cancelIdleCallback?: (handle: number) => void;
	};

export type DeferredCleanup = () => void;

export function runAfterLoad(task: () => void): DeferredCleanup {
	if (!isBrowser) {
		return () => {};
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
		return () => {};
	}

	const idleWindow = window as IdleWindow;

	if (typeof idleWindow.requestIdleCallback === 'function') {
		const handle = idleWindow.requestIdleCallback(task, { timeout });
		return () => {
			idleWindow.cancelIdleCallback?.(handle);
		};
	}

	const handle = window.setTimeout(task, 120);
	return () => window.clearTimeout(handle);
}

export function runAfterLoadAndIdle(task: () => void, timeout = 1500): DeferredCleanup {
	let cancelIdle: DeferredCleanup = () => {};

	const cancelLoad = runAfterLoad(() => {
		cancelIdle = runWhenIdle(task, timeout);
	});

	return () => {
		cancelLoad();
		cancelIdle();
	};
}
