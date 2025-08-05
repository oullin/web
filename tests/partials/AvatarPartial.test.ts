import { mount } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { describe, it, expect } from 'vitest';
import AvatarPartial from '@partials/AvatarPartial.vue';

describe('AvatarPartial', () => {
	it('applies default size classes', () => {
		const wrapper = mount(AvatarPartial, { props: { width: 'w-20', height: 'h-20' } });
		const img = wrapper.find('img');
		expect(img.classes()).toContain('w-20');
		expect(img.classes()).toContain('h-20');
	});

	it('accepts custom size classes', () => {
		const width: string = `w-${faker.number.int({ min: 5, max: 20 })}`;
		const height: string = `h-${faker.number.int({ min: 5, max: 20 })}`;
		const wrapper = mount(AvatarPartial, { props: { width, height } });
		const img = wrapper.find('img');
		expect(img.classes()).toContain(width);
		expect(img.classes()).toContain(height);
	});
});
