import { generateUrl } from '../src/adapters/generate-url';

describe('generateUrl', () => {
    test('generates a url for the specified pattern and keys', () => {
        const url = generateUrl('/departments/:id', { id: 'electronics' });
        expect(url).toEqual('/departments/electronics');
    });

    test('generates a url using the cache', () => {
        const url = generateUrl('/departments/:id', { id: 'music' });
        expect(url).toEqual('/departments/music');
    });

    test('generates the url "/" when pattern and keys are defaulted', () => {
        const url = generateUrl();
        expect(url).toEqual('/');
    });
});
