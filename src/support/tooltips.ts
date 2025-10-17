import { ref } from 'vue';
import type { Ref } from 'vue';

export interface TooltipState {
	show: boolean;
	content: string;
	top: string;
	left: string;
}

function initialState(): TooltipState {
	return {
		show: false,
		content: '',
		top: '0px',
		left: '0px',
	};
}

export function useTooltip(): {
	tooltip: Ref<TooltipState>;
	showTooltip: (event: MouseEvent, content: string) => void;
	hideTooltip: () => void;
} {
	const tooltip: Ref<TooltipState> = ref(initialState());

	const showTooltip = (event: MouseEvent, content: string): void => {
		const target = event.currentTarget as HTMLElement | null;

		if (!target) {
			return;
		}

		const rect = target.getBoundingClientRect();

		tooltip.value = {
			show: true,
			content,
			top: `${window.scrollY + rect.top}px`,
			left: `${window.scrollX + rect.left + rect.width / 2}px`,
		};
	};

	const hideTooltip = (): void => {
		tooltip.value.show = false;
	};

	return { tooltip, showTooltip, hideTooltip };
}
