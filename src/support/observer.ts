import type { Ref } from 'vue';

type SectionNavigationItem = {
	href: string;
};

let sectionObserver: IntersectionObserver | null = null;
let manuallySelectedSectionId: string | null = null;

const getSectionElements = (navigationItems: readonly SectionNavigationItem[]) => {
	if (typeof document === 'undefined') {
		return [] as HTMLElement[];
	}

	return navigationItems.map((item) => document.querySelector<HTMLElement>(`[data-section-id='${item.href.slice(1)}']`)).filter((section): section is HTMLElement => Boolean(section));
};

const ensureInitialSectionId = (sections: HTMLElement[], sectionIds: ReadonlySet<string>, activeSectionId: Ref<string>) => {
	if (sections.length > 0 && !sectionIds.has(activeSectionId.value)) {
		const initialSectionId = sections[0].dataset.sectionId;

		if (initialSectionId) {
			activeSectionId.value = initialSectionId;
		}
	}
};

const createObserver = (activeSectionId: Ref<string>, rootMargin: string) =>
	new IntersectionObserver(
		(entries) => {
			const visibleEntries = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);

			if (visibleEntries.length > 0) {
				const { sectionId } = (visibleEntries[0].target as HTMLElement).dataset;

				if (sectionId) {
					if (manuallySelectedSectionId && manuallySelectedSectionId !== sectionId) {
						return;
					}

					activeSectionId.value = sectionId;

					if (manuallySelectedSectionId === sectionId) {
						manuallySelectedSectionId = null;
					}
				}
			}
		},
		{ rootMargin },
	);

export const observeSections = (navigationItems: readonly SectionNavigationItem[], activeSectionId: Ref<string>, rootMargin = '-40% 0px -40%') => {
	if (typeof window === 'undefined' || typeof document === 'undefined') {
		return;
	}

	const observedSections = getSectionElements(navigationItems);
	const observedSectionIds = new Set(observedSections.map((section) => section.dataset.sectionId).filter((sectionId): sectionId is string => Boolean(sectionId)));

	if (observedSections.length === 0) {
		disconnectSectionsObserver();
		return;
	}

	ensureInitialSectionId(observedSections, observedSectionIds, activeSectionId);

	if (typeof IntersectionObserver === 'undefined') {
		return;
	}

	sectionObserver?.disconnect();
	sectionObserver = createObserver(activeSectionId, rootMargin);
	observedSections.forEach((section) => {
		sectionObserver?.observe(section);
	});
};

export const disconnectSectionsObserver = () => {
	sectionObserver?.disconnect();
	sectionObserver = null;
	manuallySelectedSectionId = null;
};

export const setManuallySelectedSectionId = (sectionId: string | null) => {
	manuallySelectedSectionId = sectionId;
};
