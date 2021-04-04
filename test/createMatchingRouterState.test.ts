import { Path, parsePath } from 'history';
import { createMatchingRouterState, createRouterState, Route } from '../src';

const routes: Route[] = [
    { name: 'home', pattern: '/' },
    {
        name: 'departments',
        pattern: '/departments',
    },
    {
        name: 'department-category',
        pattern: '/departments/:id/:category',
        altPatterns: ['/sections/:id/:category'],
    },
    {
        name: 'users',
        pattern: '/users',
    },
    { name: 'notFound', pattern: '/not-found' },
];

describe('createMatchingRouterState', () => {
    test('returns RouterState when url matches pattern, no params, no queryParams', () => {
        const routerState = createMatchingRouterState(
            parsePath('/departments') as Path,
            routes
        );
        expect(routerState).toEqual(createRouterState('departments'));
    });

    test('returns RouterState when url matches pattern, params, no queryParams', () => {
        const routerState = createMatchingRouterState(
            parsePath('/departments/electronics/computers') as Path,
            routes
        );
        expect(routerState).toEqual(
            createRouterState('department-category', {
                params: { id: 'electronics', category: 'computers' },
            })
        );
    });

    test('returns RouterState when url matches pattern, params, single queryParam', () => {
        const routerState = createMatchingRouterState(
            parsePath('/departments/electronics/computers?q=apple') as Path,
            routes
        );
        expect(routerState).toEqual(
            createRouterState('department-category', {
                params: { id: 'electronics', category: 'computers' },
                queryParams: { q: 'apple' },
            })
        );
    });

    test('returns RouterState when url matches pattern, params, multiple queryParams', () => {
        const routerState = createMatchingRouterState(
            parsePath(
                '/departments/electronics/computers?q=apple&r=pear'
            ) as Path,
            routes
        );
        expect(routerState).toEqual(
            createRouterState('department-category', {
                params: { id: 'electronics', category: 'computers' },
                queryParams: { q: 'apple', r: 'pear' },
            })
        );
    });

    test('returns RouterState when url matches altPattern', () => {
        const routerState = createMatchingRouterState(
            parsePath('/sections/electronics/computers') as Path,
            routes
        );
        expect(routerState).toEqual(
            createRouterState('department-category', {
                params: { id: 'electronics', category: 'computers' },
            })
        );
    });

    test('returns RouterState when url contains bracket format arrays', () => {
        const routerState = createMatchingRouterState(
            parsePath('/users?userIds[]=1&userIds[]=2&userIds[]=3') as Path,
            routes,
            { arrayFormat: 'bracket' }
        );
        expect(routerState).toEqual(
            createRouterState('users', {
                queryParams: { userIds: ['1', '2', '3'] },
            })
        );
    });

    test('returns undefined when url matches no pattern', () => {
        const routerState = createMatchingRouterState(
            parsePath('/notValidUrl') as Path,
            routes
        );
        expect(routerState).toEqual(undefined);
    });
});
