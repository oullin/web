import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUserStore } from '@stores/users/user.ts';
import { Response } from '@stores/users/response.ts';

const storageKey = `user-bucket-${Response.salt}`;

describe('useUserStore', () => {
	let store: ReturnType<typeof useUserStore>;

	beforeEach(() => {
		setActivePinia(createPinia());
		localStorage.clear();
		store = useUserStore();
	});

	it('computes storage key', () => {
		expect(store.getStorageKey()).toBe(storageKey);
	});

	it('boots and loads profile from seed', () => {
		store.boot();
		expect(store.profile?.nickname).toBe(Response.nickname);
		const saved = JSON.parse(localStorage.getItem(storageKey)!);
		expect(saved.nickname).toBe(Response.nickname);
	});

	it('onBoot initializes social media and callback', () => {
		let called = false;
		store.onBoot(() => {
			called = true;
		});
		expect(called).toBe(true);
		expect(store.socialMedia?.github.handle).toBe('gocanto');
	});

	it('booted helpers work', () => {
		expect(store.booted()).toBe(false);
		expect(store.hasNotBooted()).toBe(true);
		store.boot();
		expect(store.booted()).toBe(true);
		expect(store.hasNotBooted()).toBe(false);
	});

	it('returns social media map', () => {
		store.boot();
		const map = store.getSocialMedia();
		expect(map.github.handle).toBe('gocanto');
	});
});
