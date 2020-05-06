import { findMatchingRoute } from '../src/adapters/match-current-route';
import { createLocation } from 'history';
import { Route } from '../src/router-store';

const routes: Route[] = [
    { name: 'home', pattern: '/' },
    {
        name: 'department',
        pattern: '/departments'
    },
    {
        name: 'department-category',
        pattern: '/departments/:id/:category'
    },
    { name: 'notFound', pattern: '/not-found' }
];

describe('findMatchingRoute', () => {
    test('returns params when url matches pattern, no params, no queryParams', () => {
        const jsRouterState = findMatchingRoute(
            createLocation('/departments'),
            routes
        );
        expect(jsRouterState).toEqual({
            routeName: 'department',
            params: {},
            queryParams: {}
        });
    });

    test('returns params when url matches pattern, params, no queryParams', () => {
        const jsRouterState = findMatchingRoute(
            createLocation('/departments/electronics/computers'),
            routes
        );
        expect(jsRouterState).toEqual({
            routeName: 'department-category',
            params: { id: 'electronics', category: 'computers' },
            queryParams: {}
        });
    });

    test('returns params when url matches pattern, params, single queryParam', () => {
        const jsRouterState = findMatchingRoute(
            createLocation('/departments/electronics/computers?q=apple'),
            routes
        );
        expect(jsRouterState).toEqual({
            routeName: 'department-category',
            params: { id: 'electronics', category: 'computers' },
            queryParams: { q: 'apple' }
        });
    });

    test('returns params when url matches pattern, params, multiple queryParams', () => {
        const jsRouterState = findMatchingRoute(
            createLocation('/departments/electronics/computers?q=apple&r=pear'),
            routes
        );
        expect(jsRouterState).toEqual({
            routeName: 'department-category',
            params: { id: 'electronics', category: 'computers' },
            queryParams: { q: 'apple', r: 'pear' }
        });
    });

    test('returns undefined when url matches no pattern', () => {
        const jsRouterState = findMatchingRoute(
            createLocation('/notValidUrl'),
            routes
        );
        expect(jsRouterState).toEqual(undefined);
    });
});
