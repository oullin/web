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
		expect(wrapper.text()).toContain('In Aztec tradition, Ollin means “movement” or “motion,” embodying transformation');
		wrapper.unmount();
	});

	it('opens and closes the dialog when interacting with the read more link', async () => {
		const wrapper = mount(WidgetOullinPartial, { attachTo: document.body });

		await wrapper.get('button').trigger('click');

		expect(document.body.textContent).toContain('For anyone on the path of self-discovery, Ollin becomes a guide');

		const closeButton = new DOMWrapper(document.body).get('[data-testid="oullin-dialog-close-button"]');

		await closeButton.trigger('click');
		await nextTick();

		expect(document.body.textContent).not.toContain('For anyone on the path of self-discovery, Ollin becomes a guide');
		wrapper.unmount();
	});

	it('restores focus and body scroll when closing the dialog', async () => {
		const wrapper = mount(WidgetOullinPartial, { attachTo: document.body });
		const triggerButton = wrapper.get('button');

		triggerButton.element.focus();
		await triggerButton.trigger('click');
		await nextTick();

		expect(document.body.style.overflow).toBe('hidden');

		const closeButton = new DOMWrapper(document.body).get('[data-testid="oullin-dialog-close-button"]');

		expect(document.activeElement).toBe(closeButton.element);

		await closeButton.trigger('click');
		await nextTick();

		expect(document.body.style.overflow).toBe('');
		expect(document.activeElement).toBe(triggerButton.element);

		wrapper.unmount();
	});

	it('closes when pressing the Escape key', async () => {
		const wrapper = mount(WidgetOullinPartial, { attachTo: document.body });

		await wrapper.get('button').trigger('click');
		await nextTick();

		expect(document.body.textContent).toContain('For anyone on the path of self-discovery, Ollin becomes a guide');

		const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
		document.dispatchEvent(escapeEvent);
		await nextTick();

		expect(document.body.textContent).not.toContain('For anyone on the path of self-discovery, Ollin becomes a guide');

		wrapper.unmount();
	});

	it('keeps focus within the dialog when tabbing', async () => {
		const wrapper = mount(WidgetOullinPartial, { attachTo: document.body });

		await wrapper.get('button').trigger('click');
		await nextTick();

		const closeButton = new DOMWrapper(document.body).get('[data-testid="oullin-dialog-close-button"]');

		closeButton.element.focus();

		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
		expect(document.activeElement).toBe(closeButton.element);

		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true }));
		expect(document.activeElement).toBe(closeButton.element);

		wrapper.unmount();
	});
});
