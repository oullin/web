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

// @ts-ignore
if (!globalThis.localStorage) {
	// @ts-ignore
	globalThis.localStorage = new LocalStorageMock();
}
