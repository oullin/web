const RESUME_SECTION_MIN_HEIGHTS = Object.freeze({
	education: { base: 26, lg: 28 },
	experience: { base: 34, lg: 36 },
	recommendations: { base: 30, lg: 32 },
} as const);

export function getResumeSectionMinHeights() {
	return RESUME_SECTION_MIN_HEIGHTS;
}
