import { generateUrl } from '../src/adapters/generate-url';

describe('generateUrl', () => {
    test('generates the url "/" when pattern and params are defaulted', () => {
        const url = generateUrl();
        expect(url).toEqual('/');
    });

    test('generates a url for the specified pattern and params', () => {
        const url = generateUrl('/departments/:id', { id: 'electronics' });
        expect(url).toEqual('/departments/electronics');
    });

    test('generates a url using the cache', () => {
        const url = generateUrl('/departments/:id', { id: 'music' });
        expect(url).toEqual('/departments/music');
    });

    test('appends the specified query parameters', () => {
        const url = generateUrl('/items', {}, { q: 'apple' });
        expect(url).toEqual('/items?q=apple');
    });

    test('appends the specified parameters and query parameters', () => {
        const url = generateUrl(
            '/departments/:id',
            { id: 'electronics' },
            { q: 'apple' }
        );
        expect(url).toEqual('/departments/electronics?q=apple');
    });
});
