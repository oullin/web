import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AliasOptions } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const exactAliases: AliasOptions = [
	['@components/CoverImageLoader.vue', './src/components/CoverImg.vue'],
	['@components/icons/LinkedinIcon.vue', './src/components/icons/Linkedin.vue'],
	['@pages/ContactPage.vue', './src/pages/Contact.vue'],
	['@pages/ProjectsPage.vue', './src/pages/Projects.vue'],
	['@pages/TagPostsPage.vue', './src/pages/TagPosts.vue'],
	['@pages/TermsAndPoliciesPage.vue', './src/pages/TermsPage.vue'],
	['@pages/WorkWithUsPage.vue', './src/pages/WorkUs.vue'],
	['@pages/WritingPage.vue', './src/pages/Writing.vue'],
	['@partials/AboutConnectSkeletonPartial.vue', './src/partials/AbtConnSk.vue'],
	['@partials/ArticleItemPartial.vue', './src/partials/ArtItem.vue'],
	['@partials/ArticleItemSkeletonPartial.vue', './src/partials/ArtItemSk.vue'],
	['@partials/ArticlesListPartial.vue', './src/partials/ArtList.vue'],
	['@partials/FooterPartial.vue', './src/partials/Footer.vue'],
	['@partials/HeroCircuitPartial.vue', './src/partials/HeroCirc.vue'],
	['@partials/HeroPartial.vue', './src/partials/Hero.vue'],
	['@partials/NavPartial.vue', './src/partials/NavBar.vue'],
	['@partials/PostPageSkeletonPartial.vue', './src/partials/PostPgSkl.vue'],
	['@partials/ProjectCardPartial.vue', './src/partials/ProjCard.vue'],
	['@partials/ProjectCardSkeletonPartial.vue', './src/partials/ProjCardSk.vue'],
	['@partials/RecommendationDialogSkeletonPartial.vue', './src/partials/RecDlgSkel.vue'],
	['@partials/RecommendationPartial.vue', './src/partials/RecomPart.vue'],
	['@/support/content-types.ts', './src/support/contype.ts'],
	['@support/content-types.ts', './src/support/contype.ts'],
	['@/support/lazy-loading.ts', './src/support/lazyload.ts'],
	['@support/lazy-loading.ts', './src/support/lazyload.ts'],
	['@/support/useTextHighlight.ts', './src/support/useTxtHi.ts'],
	['@support/useTextHighlight.ts', './src/support/useTxtHi.ts'],
	['@/support/content/contact-page.ts', './src/support/content/contpage.ts'],
	['@support/content/contact-page.ts', './src/support/content/contpage.ts'],
	['@/support/content/projects-page.ts', './src/support/content/projpage.ts'],
	['@support/content/projects-page.ts', './src/support/content/projpage.ts'],
	['@/support/content/terms-and-policies-page.ts', './src/support/content/termspage.ts'],
	['@support/content/terms-and-policies-page.ts', './src/support/content/termspage.ts'],
	['@/support/content/work-with-us-page.ts', './src/support/content/workpage.ts'],
	['@support/content/work-with-us-page.ts', './src/support/content/workpage.ts'],
	['@/support/content/writing-page.ts', './src/support/content/writpage.ts'],
	['@support/content/writing-page.ts', './src/support/content/writpage.ts'],
].map(([find, replacement]) => ({ find, replacement: path.resolve(__dirname, replacement) }));

export const aliases: AliasOptions = [
	...exactAliases,
	// allow importing modules with a leading ~ like CSS preprocessors produce
	{ find: /^~.+/, replacement: '$1' },
	{ find: '@', replacement: path.resolve(__dirname, './src') },
	{ find: '@css', replacement: path.resolve(__dirname, './src/css') },
	{ find: '@pages', replacement: path.resolve(__dirname, './src/pages') },
	{ find: '@components', replacement: path.resolve(__dirname, './src/components') },
	{ find: '@fonts', replacement: path.resolve(__dirname, './src/fonts') },
	{ find: '@images', replacement: path.resolve(__dirname, './src/images') },
	{ find: '@public', replacement: path.resolve(__dirname, './src/public') },
	{ find: '@partials', replacement: path.resolve(__dirname, './src/partials') },
	{ find: '@stores', replacement: path.resolve(__dirname, './src/stores') },
	{ find: '@api', replacement: path.resolve(__dirname, './src/stores/api') },
	{ find: '@support', replacement: path.resolve(__dirname, './src/support') },
	{ find: '@fixtures', replacement: path.resolve(__dirname, './storage/fixtures') },
	{ find: '@/lib', replacement: path.resolve(__dirname, './src/lib') },
];
