import { describe, it, expect, vi, afterEach } from 'vitest';

type LazyDirective = NonNullable<typeof import('@/support/lazy-loading.ts')['lazyLinkDirective']>;

type MockObserverInstance = {
        observe: ReturnType<typeof vi.fn>;
        unobserve: ReturnType<typeof vi.fn>;
        disconnect: ReturnType<typeof vi.fn>;
        trigger: (target: Element, isIntersecting?: boolean) => void;
};

const installMockIntersectionObserver = () => {
        const instances: MockObserverInstance[] = [];

        class MockIntersectionObserver {
                private callback: IntersectionObserverCallback;

                public observe = vi.fn();
                public unobserve = vi.fn();
                public disconnect = vi.fn();

                constructor(callback: IntersectionObserverCallback) {
                        this.callback = callback;

                        instances.push({
                                observe: this.observe,
                                unobserve: this.unobserve,
                                disconnect: this.disconnect,
                                trigger: (target: Element, isIntersecting = true) => {
                                        const entry = { isIntersecting, target } as IntersectionObserverEntry;

                                        this.callback([entry], this as unknown as IntersectionObserver);
                                },
                        });
                }
        }

        (window as unknown as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver =
                MockIntersectionObserver as unknown as typeof IntersectionObserver;

        return instances;
};

const installIdleCallback = (options: { immediate?: boolean } = {}) => {
        let handle = 0;
        const callbacks = new Map<number, IdleRequestCallback>();
        const requestIdleCallback = vi.fn((cb: IdleRequestCallback) => {
                const id = ++handle;

                callbacks.set(id, cb);

                if (options.immediate) {
                        cb({ didTimeout: false, timeRemaining: () => 10 } as IdleDeadline);
                }

                return id;
        });

        const cancelIdleCallback = vi.fn((id: number) => {
                callbacks.delete(id);
        });

        (window as unknown as { requestIdleCallback?: typeof requestIdleCallback }).requestIdleCallback =
                requestIdleCallback as unknown as typeof window.requestIdleCallback;
        (window as unknown as { cancelIdleCallback?: typeof cancelIdleCallback }).cancelIdleCallback =
                cancelIdleCallback as unknown as typeof window.cancelIdleCallback;

        return {
                requestIdleCallback,
                cancelIdleCallback,
                runPending: () => {
                        for (const [id, cb] of callbacks.entries()) {
                                cb({ didTimeout: false, timeRemaining: () => 10 } as IdleDeadline);
                                callbacks.delete(id);
                        }
                },
        };
};

afterEach(() => {
        delete (window as { IntersectionObserver?: typeof IntersectionObserver }).IntersectionObserver;
        delete (window as { requestIdleCallback?: typeof window.requestIdleCallback }).requestIdleCallback;
        delete (window as { cancelIdleCallback?: typeof window.cancelIdleCallback }).cancelIdleCallback;
        vi.useRealTimers();
        vi.resetModules();
        vi.restoreAllMocks();
        vi.clearAllMocks();
        document.body.innerHTML = '';
        document.head.innerHTML = '';
});

const mountDirective = async () => {
        const module = await import('@/support/lazy-loading.ts');

        return module.lazyLinkDirective as LazyDirective;
};

const withDirective = async (
        setup: (directive: LazyDirective, router: typeof import('@/router')['default']) => Promise<void> | void,
) => {
        vi.resetModules();

        const routerModule = await import('@/router');
        const directive = await mountDirective();

        await setup(directive, routerModule.default);
};

describe('lazyLinkDirective', () => {
        it('ignores links with non-prefetchable hrefs', async () => {
                installMockIntersectionObserver();
                const idle = installIdleCallback({ immediate: true });

                await withDirective(async (directive) => {
                        const element = document.createElement('a');
                        element.setAttribute('href', 'mailto:hello@example.com');

                        directive.mounted?.(element as HTMLAnchorElement, undefined as never);

                        expect(element.dataset.lazyLink).toBe('ignored');
                        expect(idle.requestIdleCallback).not.toHaveBeenCalled();
                });
        });

        it('ignores external absolute URLs', async () => {
                installMockIntersectionObserver();
                installIdleCallback({ immediate: true });

                await withDirective(async (directive) => {
                        const element = document.createElement('a');
                        element.setAttribute('href', 'https://example.com/about');

                        directive.mounted?.(element as HTMLAnchorElement, undefined as never);

                        expect(element.dataset.lazyLink).toBe('ignored');
                });
        });

        it('prefetches when the link becomes visible', async () => {
                const observers = installMockIntersectionObserver();
                const idle = installIdleCallback({ immediate: true });

                await withDirective(async (directive, router) => {
                        const element = document.createElement('a');
                        element.setAttribute('href', `${window.location.origin}/about?foo=1#bio`);

                        const componentSpy = vi.fn().mockResolvedValue(undefined);
                        const resolveSpy = vi.spyOn(router, 'resolve').mockReturnValue({
                                matched: [
                                        {
                                                components: {
                                                        default: componentSpy,
                                                        sidebar: componentSpy,
                                                },
                                        },
                                ],
                        } as unknown as ReturnType<typeof router.resolve>);

                        directive.mounted?.(element as HTMLAnchorElement, undefined as never);

                        expect(element.dataset.lazyLink).toBe('observed');
                        expect(observers).toHaveLength(1);
                        expect(observers[0]?.observe).toHaveBeenCalledWith(element);

                        observers[0]?.trigger(element);

                        expect(idle.requestIdleCallback).toHaveBeenCalledTimes(1);
                        expect(resolveSpy).toHaveBeenCalledWith('/about?foo=1#bio');
                        expect(componentSpy).toHaveBeenCalledTimes(2);
                        expect(element.dataset.lazyLink).toBe('prefetched');

                        // Ensure duplicate triggers do not queue another idle callback
                        element.dispatchEvent(new Event('pointerenter'));
                        expect(idle.requestIdleCallback).toHaveBeenCalledTimes(1);
                });
        });

        it('reinitialises listeners when href changes during updates', async () => {
                const observers = installMockIntersectionObserver();
                const idle = installIdleCallback({ immediate: true });

                await withDirective(async (directive, router) => {
                        const element = document.createElement('a');
                        element.setAttribute('href', '/about');

                        const componentSpy = vi.fn().mockResolvedValue(undefined);
                        const resolveSpy = vi.spyOn(router, 'resolve').mockReturnValue({
                                matched: [
                                        {
                                                components: { default: componentSpy },
                                        },
                                ],
                        } as unknown as ReturnType<typeof router.resolve>);

                        directive.mounted?.(element as HTMLAnchorElement, undefined as never);

                        observers[0]?.trigger(element);

                        expect(resolveSpy).toHaveBeenCalledWith('/about');
                        expect(componentSpy).toHaveBeenCalledTimes(1);

                        element.setAttribute('href', '/projects');
                        directive.updated?.(element as HTMLAnchorElement, undefined as never);

                        expect(observers[0]?.unobserve).toHaveBeenCalledWith(element);
                        expect(observers[0]?.disconnect).toHaveBeenCalled();
                        expect(element.dataset.lazyLink).toBe('observed');
                        expect(observers).toHaveLength(2);

                        observers[1]?.trigger(element);

                        expect(resolveSpy).toHaveBeenLastCalledWith('/projects');
                        expect(componentSpy).toHaveBeenCalledTimes(2);

                        directive.unmounted?.(element as HTMLAnchorElement, undefined as never);

                        expect(observers[1]?.unobserve).toHaveBeenCalledWith(element);
                        expect(observers[1]?.disconnect).toHaveBeenCalled();
                        expect(element.dataset.lazyLink).toBeUndefined();
                });
        });

        it('cancels scheduled prefetch work when unmounted before it runs', async () => {
                installMockIntersectionObserver();
                const idle = installIdleCallback();

                await withDirective(async (directive, router) => {
                        const element = document.createElement('a');
                        element.setAttribute('href', '/about');

                        vi.spyOn(router, 'resolve').mockReturnValue({ matched: [] } as unknown as ReturnType<typeof router.resolve>);

                        directive.mounted?.(element as HTMLAnchorElement, undefined as never);

                        element.dispatchEvent(new Event('pointerenter'));

                        expect(idle.requestIdleCallback).toHaveBeenCalledTimes(1);

                        directive.unmounted?.(element as HTMLAnchorElement, undefined as never);

                        expect(idle.cancelIdleCallback).toHaveBeenCalledTimes(1);
                        expect(element.dataset.lazyLink).toBeUndefined();
                });
        });

        it('falls back to timeouts when requestIdleCallback is unavailable', async () => {
                const observers = installMockIntersectionObserver();
                delete (window as { requestIdleCallback?: typeof window.requestIdleCallback }).requestIdleCallback;
                delete (window as { cancelIdleCallback?: typeof window.cancelIdleCallback }).cancelIdleCallback;

                vi.resetModules();
                vi.useFakeTimers();

                const routerModule = await import('@/router');
                const directive = await mountDirective();

                const element = document.createElement('a');
                element.setAttribute('href', '/resume');

                const componentSpy = vi.fn();
                const resolveSpy = vi.spyOn(routerModule.default, 'resolve').mockReturnValue({
                        matched: [
                                {
                                        components: { default: componentSpy },
                                },
                        ],
                } as unknown as ReturnType<typeof routerModule.default.resolve>);
                const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');

                directive.mounted?.(element as HTMLAnchorElement, undefined as never);

                expect(observers).toHaveLength(1);
                observers[0]?.trigger(element);

                expect(resolveSpy).not.toHaveBeenCalled();

                directive.unmounted?.(element as HTMLAnchorElement, undefined as never);

                expect(resolveSpy).not.toHaveBeenCalled();
                expect(clearTimeoutSpy).toHaveBeenCalled();

                vi.runAllTimers();

                expect(resolveSpy).not.toHaveBeenCalled();
                vi.useRealTimers();
        });

        it('does not prefetch routes that were already prefetched elsewhere', async () => {
                const observers = installMockIntersectionObserver();
                const idle = installIdleCallback({ immediate: true });

                await withDirective(async (directive, router) => {
                        const componentSpy = vi.fn();
                        const resolveSpy = vi.spyOn(router, 'resolve').mockReturnValue({
                                matched: [
                                        {
                                                components: { default: componentSpy },
                                        },
                                ],
                        } as unknown as ReturnType<typeof router.resolve>);

                        const first = document.createElement('a');
                        first.setAttribute('href', '/about');
                        directive.mounted?.(first as HTMLAnchorElement, undefined as never);
                        observers[0]?.trigger(first);

                        expect(resolveSpy).toHaveBeenCalledTimes(1);
                        expect(componentSpy).toHaveBeenCalledTimes(1);

                        const second = document.createElement('a');
                        second.setAttribute('href', '/about');
                        directive.mounted?.(second as HTMLAnchorElement, undefined as never);
                        observers[1]?.trigger(second);

                        expect(resolveSpy).toHaveBeenCalledTimes(1);
                        expect(componentSpy).toHaveBeenCalledTimes(1);
                        expect(second.dataset.lazyLink).toBe('observed');

                        second.dispatchEvent(new Event('focus'));
                        expect(idle.requestIdleCallback).toHaveBeenCalledTimes(1);
                });
        });
});
