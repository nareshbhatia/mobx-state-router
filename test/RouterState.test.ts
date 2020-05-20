import { createRouterState } from '../src';

describe('RouterState', () => {
    test('can be created with only a routeName', () => {
        const routerState = createRouterState('home');
        expect(routerState).toMatchObject({
            routeName: 'home',
        });
    });

    test('can be created with a routeName and params', () => {
        const routerState = createRouterState('department', {
            params: { id: 'department', section: 'televisions' },
        });
        expect(routerState).toMatchObject({
            routeName: 'department',
            params: {
                id: 'department',
                section: 'televisions',
            },
        });
    });

    test('can be created with a routeName and queryParams', () => {
        const routerState = createRouterState('department', {
            queryParams: { q: 'apple', items: ['E1', 'E2'] },
        });
        expect(routerState).toMatchObject({
            routeName: 'department',
            queryParams: {
                q: 'apple',
                items: ['E1', 'E2'],
            },
        });
    });

    test('can be created with a replaceHistory', () => {
        const home = createRouterState('home');
        const profile = createRouterState('profile', {
            replaceHistory: true,
        });
        expect(home).toMatchObject({
            routeName: 'home',
            options: {
                replaceHistory: false,
            },
        });
        expect(profile).toMatchObject({
            routeName: 'profile',
            options: {
                replaceHistory: true,
            },
        });
    });
});
