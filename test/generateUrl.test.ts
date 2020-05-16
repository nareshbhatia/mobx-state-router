import {
    createRouterState,
    generateUrl,
    routerStateToUrl,
    RouterStore,
} from '../src';

const routes = [{ name: 'department', pattern: '/departments/:id' }];
const notFound = createRouterState('notFound');
const deptElectronics = createRouterState('department', {
    params: { id: 'electronics' },
});
const routerStore = new RouterStore(routes, notFound);

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

describe('routerStateToUrl', () => {
    test('converts a state with with specified params to a url', () => {
        const url = routerStateToUrl(routerStore, deptElectronics);
        expect(url).toEqual('/departments/electronics');
    });
});
