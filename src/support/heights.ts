export type ResumeSection = 'education' | 'experience' | 'recommendations';

type SectionMin = Readonly<{ base: number; lg: number }>;
type SectionMinMap = Readonly<Record<ResumeSection, SectionMin>>;
type SectionClassMap = Readonly<Record<ResumeSection, string>>;

export class Heights {
	private static readonly minInResume = Object.freeze({
		education: Object.freeze({ base: 26, lg: 28 }),
		experience: Object.freeze({ base: 34, lg: 36 }),
		recommendations: Object.freeze({ base: 30, lg: 32 }),
	} satisfies SectionMinMap);

	static resumeSectionMinHeights(): SectionMinMap {
		return this.minInResume;
	}

	static resumeSectionHeights(): SectionClassMap {
		const m = this.minInResume;

		return Object.freeze({
			education: `min-h-[${m.education.base}rem] lg:min-h-[${m.education.lg}rem]`,
			experience: `min-h-[${m.experience.base}rem] lg:min-h-[${m.experience.lg}rem]`,
			recommendations: `min-h-[${m.recommendations.base}rem] lg:min-h-[${m.recommendations.lg}rem]`,
		} satisfies SectionClassMap);
	}

	static resumeSectionsTotalHeight(): string {
		const m = this.minInResume;
		const g = 3;
		const base = m.education.base + m.experience.base + m.recommendations.base + g * 2;
		const lg = m.education.lg + m.experience.lg + m.recommendations.lg + g * 2;

		return `min-h-[${base}rem] lg:min-h-[${lg}rem]`;
	}
}
