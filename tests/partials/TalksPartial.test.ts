import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import TalksPartial from '@partials/TalksPartial.vue';
import type { ApiResponse, TalksResponse } from '@api/response/index.ts';

const talks: TalksResponse[] = [
        {
                uuid: '123e4567-e89b-12d3-a456-426614174000',
                title: 'Test Talk Title',
                subject: 'Test Subject',
                location: 'Test City',
                url: '/test-talk',
                photo: 'https://example.com/photo.jpg',
                created_at: '2024-01-01T00:00:00Z',
                updated_at: '2024-01-02T00:00:00Z',
        },
];
const getTalks = vi.fn<[], Promise<ApiResponse<TalksResponse[]>>>(() =>
        Promise.resolve({ version: '1.0.0', data: talks }),
);
vi.mock('@api/store.ts', () => ({ useApiStore: () => ({ getTalks }) }));

describe('TalksPartial', () => {
        it('loads talks on mount', async () => {
                const wrapper = mount(TalksPartial);
                await flushPromises();

                expect(getTalks).toHaveBeenCalledTimes(1);
                const anchor = wrapper.find('a');
                expect(anchor.exists()).toBe(true);
                expect(anchor.attributes('href')).toBe(talks[0].url);
                expect(anchor.text()).toContain(talks[0].title);
        });
});
