export class Heights {
	private static readonly RESUME_SECTION_MIN_HEIGHTS = Object.freeze({
		education: { base: 26, lg: 28 },
		experience: { base: 34, lg: 36 },
		recommendations: { base: 30, lg: 32 },
	} as const);

	static readonly RESUME_SECTION_STACK_GAP_REM = 3;

	static resumeSectionMinHeights() {
		return this.RESUME_SECTION_MIN_HEIGHTS;
	}

	static resumeSectionHeights() {
		const { education, experience, recommendations } = this.RESUME_SECTION_MIN_HEIGHTS;

		return Object.freeze({
			education: `min-h-[${education.base}rem] lg:min-h-[${education.lg}rem]`,
			experience: `min-h-[${experience.base}rem] lg:min-h-[${experience.lg}rem]`,
			recommendations: `min-h-[${recommendations.base}rem] lg:min-h-[${recommendations.lg}rem]`,
		} as const);
	}

	static resumeSectionsTotalHeight() {
		const { education, experience, recommendations } = this.RESUME_SECTION_MIN_HEIGHTS;
		const gap = this.RESUME_SECTION_STACK_GAP_REM;

		return `min-h-[${education.base + experience.base + recommendations.base + gap * 2}rem] lg:min-h-[${education.lg + experience.lg + recommendations.lg + gap * 2}rem]` as const;
	}
}
