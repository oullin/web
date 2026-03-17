import { DOMWrapper, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import WidgetOullinPartial from '@partials/WidgetOullinPartial.vue';
import { nextTick } from 'vue';

afterEach(() => {
	document.body.innerHTML = '';
	document.body.style.overflow = '';
});

describe('WidgetOullinPartial', () => {
	it('renders intro text', () => {
		const wrapper = mount(WidgetOullinPartial);
		expect(wrapper.text()).toContain("What's Oullin?");
		expect(wrapper.text()).toContain('In Aztec tradition, Ollin means "movement" or "motion," embodying transformation');
		wrapper.unmount();
	});

	it('opens and closes the dialog when interacting with the read more link', async () => {
		const wrapper = mount(WidgetOullinPartial, { attachTo: document.body });

		await wrapper.get('[data-testid="oullin-dialog-trigger"]').trigger('click');

		expect(document.body.textContent).toContain('For anyone on the path of self-discovery, Ollin becomes a guide');

		const closeButton = new DOMWrapper(document.body).get('[data-testid="oullin-dialog-close-button"]');

		await closeButton.trigger('click');
		await nextTick();

		expect(document.body.textContent).not.toContain('For anyone on the path of self-discovery, Ollin becomes a guide');
		wrapper.unmount();
	});

	it('restores focus to the trigger when closing the dialog', async () => {
		const wrapper = mount(WidgetOullinPartial, { attachTo: document.body });
		const triggerButton = wrapper.get('[data-testid="oullin-dialog-trigger"]');

		triggerButton.element.focus();
		await triggerButton.trigger('click');
		await nextTick();

		const closeButton = new DOMWrapper(document.body).get('[data-testid="oullin-dialog-close-button"]');

		await closeButton.trigger('click');
		await nextTick();

		expect(document.activeElement).toBe(triggerButton.element);

		wrapper.unmount();
	});

	it('dialog content is accessible with title and OSS link', async () => {
		const wrapper = mount(WidgetOullinPartial, { attachTo: document.body });

		await wrapper.get('[data-testid="oullin-dialog-trigger"]').trigger('click');
		await nextTick();

		const dialog = new DOMWrapper(document.body).find('[role="dialog"]');
		expect(dialog.exists()).toBe(true);
		expect(dialog.attributes('aria-labelledby')).toBeTruthy();

		const title = new DOMWrapper(document.body).find('#oullin-dialog-title');
		expect(title.exists()).toBe(true);
		expect(title.text()).toContain("What's Oullin?");
		expect(new DOMWrapper(document.body).find('[data-testid="oullin-dialog-oss-link"]').attributes('href')).toBe('https://github.com/oullin');

		wrapper.unmount();
	});

	it('dialog contains expected focusable elements', async () => {
		const wrapper = mount(WidgetOullinPartial, { attachTo: document.body });

		await wrapper.get('[data-testid="oullin-dialog-trigger"]').trigger('click');
		await nextTick();

		const dialogWrapper = new DOMWrapper(document.body);
		const closeButton = dialogWrapper.find('[data-testid="oullin-dialog-close-button"]');
		const ossLink = dialogWrapper.find('[data-testid="oullin-dialog-oss-link"]');
		expect(closeButton.exists()).toBe(true);
		expect(ossLink.exists()).toBe(true);

		// Verify focusable elements are keyboard-reachable
		expect((closeButton.element as HTMLElement).tabIndex).not.toBe(-1);
		expect((ossLink.element as HTMLElement).tabIndex).not.toBe(-1);

		wrapper.unmount();
	});
});
