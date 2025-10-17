import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTooltip } from '@/support/tooltips.ts';

describe('useTooltip', () => {
	const scrollValues = { x: 0, y: 0 };

	beforeEach(() => {
		Object.defineProperty(window, 'scrollX', {
			configurable: true,
			get: () => scrollValues.x,
			set: (value: number) => {
				scrollValues.x = value;
			},
		});

		Object.defineProperty(window, 'scrollY', {
			configurable: true,
			get: () => scrollValues.y,
			set: (value: number) => {
				scrollValues.y = value;
			},
		});

		scrollValues.x = 12;
		scrollValues.y = 34;
	});

	it('initializes with a hidden tooltip', () => {
		const { tooltip } = useTooltip();

		expect(tooltip.value.show).toBe(false);
		expect(tooltip.value.content).toBe('');
	});

	it('shows and positions the tooltip relative to the hovered element', () => {
		const { tooltip, showTooltip } = useTooltip();
		const element = document.createElement('div');

		const rect = { top: 40, left: 80, width: 100 } satisfies Partial<DOMRect>;
		element.getBoundingClientRect = vi.fn(() => rect as DOMRect);

		const event = { currentTarget: element } as unknown as MouseEvent;

		showTooltip(event, 'Tooltip content');

		expect(tooltip.value.show).toBe(true);
		expect(tooltip.value.content).toBe('Tooltip content');
		expect(tooltip.value.top).toBe(`${scrollValues.y + rect.top}px`);
		expect(tooltip.value.left).toBe(`${scrollValues.x + rect.left + rect.width / 2}px`);
	});

	it('hides the tooltip', () => {
		const { tooltip, showTooltip, hideTooltip } = useTooltip();
		const element = document.createElement('div');

		element.getBoundingClientRect = vi.fn(() => ({ top: 0, left: 0, width: 10 }) as DOMRect);

		const event = { currentTarget: element } as unknown as MouseEvent;

		showTooltip(event, 'Tooltip content');
		expect(tooltip.value.show).toBe(true);

		hideTooltip();

		expect(tooltip.value.show).toBe(false);
	});
});
