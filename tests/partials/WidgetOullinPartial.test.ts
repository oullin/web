import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import WidgetOullinPartial from '@partials/WidgetOullinPartial.vue';
import { nextTick } from 'vue';

afterEach(() => {
	document.body.innerHTML = '';
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

		const closeButton = document.body.querySelector('button span.sr-only')?.closest('button') as HTMLButtonElement | null;

		expect(closeButton).not.toBeNull();

		closeButton?.click();
		await nextTick();

		expect(document.body.textContent).not.toContain('For anyone on the path of self-discovery, Ollin becomes a guide');
		wrapper.unmount();
	});
});
