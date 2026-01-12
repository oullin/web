export type ResumeSection = 'education' | 'experience' | 'recommendations';

type SectionMin = Readonly<{ base: number; lg: number }>;
type SectionMinMap = Readonly<Record<ResumeSection, SectionMin>>;
type SectionClassMap = Readonly<Record<ResumeSection, string>>;
type SectionSafe = ReadonlyArray<string>;

const minInResume = Object.freeze({
	education: Object.freeze({ base: 26, lg: 28 }),
	experience: Object.freeze({ base: 34, lg: 36 }),
	recommendations: Object.freeze({ base: 30, lg: 32 }),
} satisfies SectionMinMap);

const classesInResume = Object.freeze({
	education: 'min-h-[26rem] lg:min-h-[28rem]',
	experience: 'min-h-[34rem] lg:min-h-[36rem]',
	recommendations: 'min-h-[30rem] lg:min-h-[32rem]',
} satisfies SectionClassMap);

const safeInResume = Object.freeze([
	'min-h-[26rem]',
	'lg:min-h-[28rem]',
	'min-h-[34rem]',
	'lg:min-h-[36rem]',
	'min-h-[30rem]',
	'lg:min-h-[32rem]',
	'min-h-[96rem]',
	'lg:min-h-[102rem]',
] satisfies SectionSafe);

export function resumeSectionMinHeights(): SectionMinMap {
	return minInResume;
}

export function resumeSectionHeights(): SectionClassMap {
	return classesInResume;
}

export function resumeSectionsTotalHeight(): string {
	const m = minInResume;
	const g = 3;
	const base = m.education.base + m.experience.base + m.recommendations.base + g * 2;
	const lg = m.education.lg + m.experience.lg + m.recommendations.lg + g * 2;

	return `min-h-[${base}rem] lg:min-h-[${lg}rem]`;
}

export function resumeSectionHeightSafelist(): SectionSafe {
	return safeInResume;
}
