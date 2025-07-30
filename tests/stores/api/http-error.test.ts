import { describe, it, expect, vi } from 'vitest';
import { HttpError, parseError, debugError } from '@api/http-error.ts';

function makeResponse(status: number, statusText = '') {
	return new Response('body', { status, statusText });
}

describe('HttpError utilities', () => {
	it('parseError wraps generic errors', async () => {
		await expect(parseError('boom')).rejects.toThrow('An unexpected error occurred: boom');
	});

	it('parseError handles HttpError', async () => {
		const err = new HttpError(makeResponse(404, 'NF'), 'nope');
		await expect(parseError(err)).rejects.toThrow('An error occurred in the API. status [API request failed with status 404: NF] / message [nope]');
	});

	it('debugError logs details', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const err = new HttpError(makeResponse(500, 'err'), 'oops');
		debugError(err);
		debugError('fail');
		expect(spy).toHaveBeenCalled();
		spy.mockRestore();
	});
});
