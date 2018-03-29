import { matchUrl } from '../src/adapters/match-url';

describe('matchUrl', () => {
    test('returns params when url matches pattern', () => {
        const params = matchUrl(
            '/departments/electronics/computers',
            '/departments/:id/:category'
        );
        expect(params).toEqual({ id: 'electronics', category: 'computers' });
    });

    test('returns null when url does not match pattern', () => {
        const params = matchUrl(
            '/departments/electronics',
            '/departments/:id/:category'
        );
        expect(params).toBeUndefined();
    });
});
