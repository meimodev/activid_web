import { describe, it, expect } from 'vitest';
import { ensureValidProjectData } from './project-showcase.types';

// The bug this guards: mockupImages used to require exactly 9 entries, so every
// real project (1, 5 or 6 mockups) failed validation and was silently swapped for
// a placeholder path that did not exist — /work rendered "Image unavailable" x9.

const base = {
    id: 'social-01',
    client: '@baksodenny',
    projectType: 're-branding',
    description: 'desc',
    results: 'Engagement naik 60%',
};

describe('ensureValidProjectData', () => {
    it.each([1, 5, 6, 9])('keeps all %i real mockups', (n) => {
        const mockupImages = Array.from({ length: n }, (_, i) => `/img-${i}.jpg`);
        const result = ensureValidProjectData({
            ...base,
            mockupImages,
            imageAlts: mockupImages.map((_, i) => `alt ${i}`),
        });

        expect(result.mockupImages).toEqual(mockupImages);
        expect(result.imageAlts).toHaveLength(n);
    });

    it('pads alts rather than dropping images when alts are short', () => {
        const result = ensureValidProjectData({
            ...base,
            mockupImages: ['/a.jpg', '/b.jpg', '/c.jpg'],
            imageAlts: ['only one'],
        });

        expect(result.mockupImages).toHaveLength(3);
        expect(result.imageAlts).toHaveLength(3);
        expect(result.imageAlts.every(Boolean)).toBe(true);
    });

    it('never falls back to a nonexistent placeholder path', () => {
        const result = ensureValidProjectData({ ...base, mockupImages: [], imageAlts: [] });

        expect(result.mockupImages).toEqual([]);
        expect(result.mockupImages.join()).not.toContain('placeholder-image');
    });
});
