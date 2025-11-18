import { config } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { webcrypto } from 'node:crypto';

faker.seed(123);

// Mock the v-lazy-link directive
config.global.directives['lazy-link'] = {
	mounted: () => {},
	updated: () => {},
	unmounted: () => {},
};

// Ensure Web Crypto API is available in the test environment (jsdom)
if (!globalThis.crypto || !('subtle' in globalThis.crypto)) {
	// Vitest in jsdom may not expose crypto.subtle by default
	// Node provides a standards-compliant WebCrypto at node:crypto.webcrypto
	(globalThis as any).crypto = webcrypto as unknown as Crypto;
}

class LocalStorageMock {
	private store: Record<string, string> = {};
	clear() {
		this.store = {};
	}
	getItem(key: string) {
		return this.store[key] ?? null;
	}
	setItem(key: string, value: string) {
		this.store[key] = value;
	}
	removeItem(key: string) {
		delete this.store[key];
	}
}

declare global {
	var localStorage: Storage | undefined;
}

if (!globalThis.localStorage) {
	globalThis.localStorage = new LocalStorageMock() as Storage;
}
