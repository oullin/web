import { computed, type Ref } from 'vue';
import { setManuallySelectedSectionId } from '@/support/observer';

export const navigationItems = [
	{ id: 'education', href: '#education', text: 'Education' },
	{ id: 'experience', href: '#experience', text: 'Work Experience' },
	{ id: 'recommendations', href: '#recommendations', text: 'Recommendations' },
] as const;

export type SectionId = (typeof navigationItems)[number]['id'];

type SectionRefs = Record<SectionId, Ref<HTMLElement | null>>;

type SectionAvailability = Record<SectionId, boolean>;

export const createNavigationItemsWithState = (activeSectionId: Ref<SectionId>) =>
	computed(() =>
		navigationItems.map((item) => ({
			...item,
			isActive: activeSectionId.value === item.id,
		})),
	);

export const createSectionResolver = (sectionRefs: SectionRefs) => (itemId: SectionId) => {
	const sectionFromRef = sectionRefs[itemId]?.value ?? null;

	if (sectionFromRef) {
		return sectionFromRef;
	}

	if (typeof document === 'undefined') {
		return null;
	}

	return document.querySelector<HTMLElement>(`[data-section-id='${itemId}']`);
};

const defaultHistoryUpdater = (itemId: SectionId) => {
	if (typeof window === 'undefined' || typeof window.history?.pushState !== 'function') {
		return;
	}

	const targetHash = `#${itemId}`;

	if (window.location.hash === targetHash) {
		return;
	}

	window.history.pushState(null, '', targetHash);
};

const defaultScrollToSection = (section: HTMLElement) => {
	if (typeof section.scrollIntoView !== 'function') {
		return;
	}

	try {
		section.scrollIntoView({ behavior: 'smooth', block: 'start' });
	} catch {
		section.scrollIntoView();
	}
};

type CreateNavigationClickHandlerOptions = {
	activeSectionId: Ref<SectionId>;
	resolveSectionElement: (itemId: SectionId) => HTMLElement | null;
	updateHistory?: (itemId: SectionId) => void;
	scrollToSection?: (section: HTMLElement) => void;
};

export const createNavigationClickHandler =
	({ activeSectionId, resolveSectionElement, updateHistory = defaultHistoryUpdater, scrollToSection = defaultScrollToSection }: CreateNavigationClickHandlerOptions) =>
	(itemId: SectionId, event?: MouseEvent) => {
		event?.preventDefault();

		const section = resolveSectionElement(itemId);

		if (!section) {
			return;
		}

		activeSectionId.value = itemId;
		setManuallySelectedSectionId(itemId);
		updateHistory(itemId);
		scrollToSection(section);
	};

export const updateActiveSectionFromData = (activeSectionId: Ref<SectionId>, sectionsWithData: SectionAvailability) => {
	const firstSectionWithData = navigationItems.find((item) => sectionsWithData[item.id])?.id ?? null;

	if (firstSectionWithData && activeSectionId.value !== firstSectionWithData) {
		activeSectionId.value = firstSectionWithData;
	}
};
