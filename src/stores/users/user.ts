import { defineStore } from 'pinia';
import { Response } from '@stores/users/response.ts';
import type { User, Social, SocialMediaMap } from '@stores/users/userType';

const STORE_KEY = 'user-store';
const STORAGE_KEY = 'user-bucket';

export interface UserStoreState {
	salt: string;
	fullKey: string;
	profile: User | null;
	socialMedia: SocialMediaMap | null;
}

export const useUserStore = defineStore(STORE_KEY, {
	state: (): UserStoreState => ({
		salt: '',
		fullKey: '',
		profile: null,
		socialMedia: null,
	}),
	actions: {
		boot(): void {
			this.profile = resolve(this.getStorageKey(), Response);
		},
		onBoot(callback: (data: User) => void): void {
			if (this.hasNotBooted()) {
				this.boot();
			}

			if (this.profile === null) {
				return;
			}

			this.socialMedia = mapSocialMedia(this.profile.social);

			callback(this.profile);
		},
		booted(): boolean {
			return this.profile !== null;
		},
		hasNotBooted(): boolean {
			return !this.booted();
		},
		getStorageKey(): string {
			const salt = Response.salt;

			return `${STORAGE_KEY}-${salt}`;
		},
		getSocialMedia(): SocialMediaMap {
			if (this.profile === null) {
				return {};
			}

			this.socialMedia = mapSocialMedia(this.profile.social);

			return this.socialMedia;
		},
	},
});

function resolve(key: string, seed: User): User {
	const data = localStorage.getItem(key);

	if (data === null) {
		localStorage.setItem(key, JSON.stringify(seed));

		return seed;
	} else {
		try {
			return JSON.parse(data);
		} catch (error) {
			localStorage.setItem(key, JSON.stringify(seed));

			return seed;
		}
	}
}

function mapSocialMedia(items: Social[]): SocialMediaMap {
	const map: SocialMediaMap = {};

	for (const item of items) {
		map[item.name] = item;
	}

	return map;
}
