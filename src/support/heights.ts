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

	private static get classesInResume(): SectionClassMap {
		const buildClasses = (section: SectionMin) => `min-h-[${section.base}rem] lg:min-h-[${section.lg}rem]`;

		return Object.freeze({
			education: buildClasses(this.minInResume.education),
			experience: buildClasses(this.minInResume.experience),
			recommendations: buildClasses(this.minInResume.recommendations),
		} satisfies SectionClassMap);
	}

	private static get safeInResume(): SectionSafe {
		const sectionClasses = Object.values(this.classesInResume).flatMap((c) => c.split(' '));
		const totalClasses = this.resumeSectionsTotalHeight().split(' ');

		return Object.freeze([...sectionClasses, ...totalClasses]);
	}

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
