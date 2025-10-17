import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { nextTick, reactive } from 'vue';
import TooltipOverlay from '@/components/TooltipOverlay.vue';
import type { TooltipState } from '@/support/tooltips.ts';

describe('TooltipOverlay', () => {
	it('does not render when the tooltip is hidden', () => {
		const tooltip = reactive<TooltipState>({ show: false, content: '', top: '0px', left: '0px' });
		const wrapper = mount(TooltipOverlay, {
			props: { tooltip },
		});

		const tooltipElement = document.body.querySelector('.absolute.-translate-x-1\\/2');
		expect(tooltipElement).toBeNull();

		wrapper.unmount();
	});

	it('renders the tooltip content with positioning and optional classes', async () => {
		const tooltip = reactive<TooltipState>({ show: false, content: '', top: '0px', left: '0px' });
		const wrapper = mount(TooltipOverlay, {
			props: { tooltip, overlayClass: 'side-nav-tooltip custom-class' },
		});

		tooltip.show = true;
		tooltip.content = 'Tooltip content';
		tooltip.top = '10px';
		tooltip.left = '20px';

		await nextTick();

		const tooltipElement = document.body.querySelector('.custom-class') as HTMLElement | null;

		expect(tooltipElement).not.toBeNull();
		expect(tooltipElement?.textContent?.trim()).toBe('Tooltip content');
		expect(tooltipElement?.style.top).toBe('10px');
		expect(tooltipElement?.style.left).toBe('20px');

		wrapper.unmount();
	});
});
