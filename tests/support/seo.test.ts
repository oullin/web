import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Seo, SITE_NAME, SITE_URL, seo, siteUrlFor, useSeo, useSeoFromPost } from '@/support/seo.ts';
import { defineComponent, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import type { PostResponse } from '@api/response/posts-response.ts';

const serializeMeta = (selector: string): string | undefined => {
        return document.head.querySelector<HTMLMetaElement>(selector)?.getAttribute('content') ?? undefined;
};

const serializeLink = (selector: string): string | undefined => {
        return document.head.querySelector<HTMLLinkElement>(selector)?.getAttribute('href') ?? undefined;
};

const getJsonLd = (): string | null => {
        return document.getElementById('seo-jsonld')?.textContent ?? null;
};

describe('Seo.apply', () => {
        let instance: Seo;

        beforeEach(() => {
                instance = new Seo();
                document.head.innerHTML = '';
                document.body.innerHTML = '';
                document.title = '';
                window.history.replaceState(null, '', '/initial?query=1');
        });

        afterEach(() => {
                document.head.innerHTML = '';
                document.body.innerHTML = '';
                document.title = '';
                const script = document.getElementById('seo-jsonld');
                if (script) script.remove();
        });

        it('applies metadata, social tags, and structured data', () => {
                const options = {
                        title: 'Example Article',
                        description: 'A detailed description',
                        keywords: 'vue,seo',
                        image: '/images/example.png',
                        url: 'https://example.com/articles/example',
                        siteName: 'Example Site',
                        type: 'article',
                        themeColor: '#123456',
                        robots: {
                                index: false,
                                follow: true,
                                archive: false,
                                imageindex: false,
                                nocache: true,
                                noai: true,
                        },
                        twitter: {
                                card: 'summary',
                                site: '@site',
                                creator: '@author',
                        },
                        jsonLd: {
                                '@context': 'https://schema.org',
                                headline: 'Example Article',
                        },
                } satisfies Parameters<Seo['apply']>[0];

                instance.apply(options);

                const expectedTitle = `${options.title} - ${SITE_NAME}`;
                const expectedImage = new URL(options.image!, SITE_URL).toString();

                expect(document.title).toBe(expectedTitle);
                expect(serializeMeta('meta[name="description"]')).toBe(options.description);
                expect(serializeMeta('meta[name="keywords"]')).toBe(options.keywords);
                expect(serializeMeta('meta[name="robots"]')).toBe('noindex,follow,noarchive,noimageindex,nocache,noai,noimageai');
                expect(serializeMeta('meta[name="theme-color"]')).toBe(options.themeColor);
                expect(serializeMeta('meta[name="msapplication-TileColor"]')).toBe(options.themeColor);
                expect(serializeMeta('meta[name="application-name"]')).toBe(expectedTitle);
                expect(serializeMeta('meta[name="apple-mobile-web-app-title"]')).toBe(expectedTitle);

                expect(serializeLink('link[rel="canonical"]')).toBe(options.url);

                expect(serializeMeta('meta[property="og:title"]')).toBe(expectedTitle);
                expect(serializeMeta('meta[property="og:description"]')).toBe(options.description);
                expect(serializeMeta('meta[property="og:type"]')).toBe(options.type);
                expect(serializeMeta('meta[property="og:url"]')).toBe(options.url);
                expect(serializeMeta('meta[property="og:image"]')).toBe(expectedImage);
                expect(serializeMeta('meta[property="og:site_name"]')).toBe(options.siteName);

                expect(serializeMeta('meta[name="twitter:card"]')).toBe(options.twitter!.card);
                expect(serializeMeta('meta[name="twitter:site"]')).toBe(options.twitter!.site);
                expect(serializeMeta('meta[name="twitter:creator"]')).toBe(options.twitter!.creator);
                expect(serializeMeta('meta[name="twitter:title"]')).toBe(expectedTitle);
                expect(serializeMeta('meta[name="twitter:description"]')).toBe(options.description);
                expect(serializeMeta('meta[name="twitter:image"]')).toBe(expectedImage);

                expect(getJsonLd()).toBe(JSON.stringify(options.jsonLd));
        });

        it('falls back to derived URL, default robots, and removes structured data', () => {
                const fallbackPath = '/posts?category=infra';
                window.history.replaceState(null, '', fallbackPath);

                instance.apply({
                        jsonLd: { foo: 'bar' },
                });

                expect(serializeLink('link[rel="canonical"]')).toBe(siteUrlFor(fallbackPath));
                expect(getJsonLd()).toBe(JSON.stringify({ foo: 'bar' }));

                instance.apply({});

                expect(document.title).toBe(SITE_NAME);
                expect(serializeLink('link[rel="canonical"]')).toBe(siteUrlFor(fallbackPath));
                expect(serializeMeta('meta[name="robots"]')).toBe('index,follow');
                expect(serializeMeta('meta[name="theme-color"]')).toBe('#ffffff');
                expect(getJsonLd()).toBeNull();
        });
});

describe('siteUrlFor', () => {
        it('returns an absolute URL for a given path', () => {
                expect(siteUrlFor('/docs/reference')).toBe(new URL('/docs/reference', SITE_URL).toString());
        });
});

describe('SEO composition utilities', () => {
        afterEach(() => {
                vi.restoreAllMocks();
        });

        it('useSeo reacts to ref changes and stops after unmount', async () => {
                const applySpy = vi.spyOn(seo, 'apply').mockImplementation(() => {});
                const options = ref<Parameters<typeof seo.apply>[0] | null>(null);

                const wrapper = mount(
                        defineComponent({
                                setup() {
                                        useSeo(options);
                                        return () => null;
                                },
                        })
                );

                await nextTick();
                expect(applySpy).not.toHaveBeenCalled();

                options.value = { title: 'Mounted Page' };
                await nextTick();
                expect(applySpy).toHaveBeenCalledTimes(1);
                expect(applySpy).toHaveBeenLastCalledWith({ title: 'Mounted Page' });

                wrapper.unmount();

                options.value = { title: 'After Unmount' };
                await nextTick();
                expect(applySpy).toHaveBeenCalledTimes(1);
        });

        it('useSeoFromPost derives seo metadata from a post response', async () => {
                const applySpy = vi.spyOn(seo, 'apply').mockImplementation(() => {});
                const post = ref<PostResponse | null>(null);

                const wrapper = mount(
                        defineComponent({
                                setup() {
                                        useSeoFromPost(post);
                                        return () => null;
                                },
                        })
                );

                await nextTick();
                expect(applySpy).not.toHaveBeenCalled();

                const samplePost: PostResponse = {
                        uuid: 'post-1',
                        author: {
                                uuid: 'author-1',
                                first_name: 'Gus',
                                last_name: 'Tester',
                                username: 'gtester',
                                display_name: 'Gus Tester',
                                bio: 'Bio',
                                picture_file_name: 'pic.jpg',
                                profile_picture_url: 'https://example.com/pic.jpg',
                        },
                        categories: [],
                        tags: [],
                        slug: 'debugging-deployments',
                        title: 'Debugging Deployments',
                        excerpt: 'Steps to debug complex deployments.',
                        content: '## Content',
                        cover_image_url: 'https://example.com/cover.jpg',
                        published_at: '2025-01-01T00:00:00Z',
                        created_at: '2025-01-01T00:00:00Z',
                        updated_at: '2025-01-01T00:00:00Z',
                };

                post.value = samplePost;
                await nextTick();

                expect(applySpy).toHaveBeenCalledTimes(1);
                expect(applySpy).toHaveBeenLastCalledWith({
                        title: samplePost.title,
                        description: samplePost.excerpt,
                        image: samplePost.cover_image_url,
                        type: 'article',
                        url: siteUrlFor(`/post/${samplePost.slug}`),
                        jsonLd: {
                                '@context': 'https://schema.org',
                                '@type': 'Article',
                                headline: samplePost.title,
                                description: samplePost.excerpt,
                                image: samplePost.cover_image_url,
                                datePublished: samplePost.published_at,
                                author: {
                                        '@type': 'Person',
                                        name: SITE_NAME,
                                },
                        },
                });

                wrapper.unmount();
                post.value = samplePost;
                await nextTick();
                expect(applySpy).toHaveBeenCalledTimes(1);
        });
});
