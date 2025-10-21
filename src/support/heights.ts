export type ResumeSection = 'education' | 'experience' | 'recommendations';

type SectionMin = Readonly<{ base: number; lg: number }>;
type SectionMinMap = Readonly<Record<ResumeSection, SectionMin>>;
type SectionClassMap = Readonly<Record<ResumeSection, string>>;
type SectionSafe = ReadonlyArray<string>;

export class Heights {
	private static readonly minInResume = Object.freeze({
		education: Object.freeze({ base: 26, lg: 28 }),
		experience: Object.freeze({ base: 34, lg: 36 }),
		recommendations: Object.freeze({ base: 42, lg: 44.8 }),
	} satisfies SectionMinMap);

	private static readonly classesInResume = Object.freeze({
		education: 'min-h-[26rem] lg:min-h-[28rem]',
		experience: 'min-h-[34rem] lg:min-h-[36rem]',
		recommendations: 'min-h-[42rem] lg:min-h-[44.8rem]',
	} satisfies SectionClassMap);

	private static readonly safeInResume = Object.freeze([
		'min-h-[26rem]',
		'lg:min-h-[28rem]',
		'min-h-[34rem]',
		'lg:min-h-[36rem]',
		'min-h-[42rem]',
		'lg:min-h-[44.8rem]',
		'min-h-[108rem]',
		'lg:min-h-[114.8rem]',
	] satisfies SectionSafe);

	static resumeSectionMinHeights(): SectionMinMap {
		return this.minInResume;
	}

	static resumeSectionHeights(): SectionClassMap {
		return this.classesInResume;
	}

	static resumeSectionsTotalHeight(): string {
		const m = this.minInResume;
		const g = 3;
		const base = m.education.base + m.experience.base + m.recommendations.base + g * 2;
		const lg = m.education.lg + m.experience.lg + m.recommendations.lg + g * 2;

		return `min-h-[${base}rem] lg:min-h-[${lg}rem]`;
	}

	static resumeSectionHeightSafelist(): SectionSafe {
		return this.safeInResume;
	}
}
