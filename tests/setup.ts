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
