import { valueEqual } from '@react-force/utils';
import { createRouterState, Route, RouterStore } from '../src';

const routes: Route[] = [
    { name: 'home', pattern: '/' },
    { name: 'department', pattern: '/departments/:id' },
    { name: 'gym', pattern: '/gym' },
    { name: 'gasStation', pattern: '/gas-station' },
    { name: 'notFound', pattern: '/not-found' },
    {
        name: 'work',
        pattern: '/work',
        beforeExit: async () => {
            return gym;
        },
    },
    {
        name: 'vacation',
        pattern: '/vacation',
        beforeEnter: async () => {
            return mountains;
        },
    },
    {
        name: 'mountains',
        pattern: '/mountains',
        beforeEnter: async () => {
            return gasStation;
        },
    },
    {
        name: 'sea',
        pattern: '/sea',
        onExit: async () => {
            return gasStation;
        },
    },
    {
        name: 'dessert',
        pattern: '/dessert',
        onEnter: async () => {
            return gasStation;
        },
    },
    {
        name: 'startLoop',
        pattern: '/start-loop',
        onEnter: async () => {
            return endLoop;
        },
    },
    {
        name: 'endLoop',
        pattern: '/end-loop',
        onEnter: async () => {
            return startLoop;
        },
    },
    {
        name: 'errorRoute',
        pattern: '/error',
        onEnter: () => {
            throw new Error('Internal error');
        },
    },
];

const home = createRouterState('home');
const notFound = createRouterState('notFound');
const deptElectronics = createRouterState('department', {
    params: { id: 'electronics' },
});
const deptMusic = createRouterState('department', { params: { id: 'music' } });
const deptElectronicsQuery = createRouterState('department', {
    params: { id: 'electronics' },
    queryParams: { q: 'apple' },
});
const gym = createRouterState('gym');
const gasStation = createRouterState('gasStation');
const work = createRouterState('work');
const mountains = createRouterState('mountains');
const sea = createRouterState('sea');
const dessert = createRouterState('dessert');
const errorState = createRouterState('errorRoute');
const vacation = createRouterState('vacation');
const startLoop = createRouterState('startLoop');
const endLoop = createRouterState('endLoop');

describe('RouterStore', () => {
    test('transitions to the desired state using goto()', () => {
        expect.assertions(1);

        const routerStore = new RouterStore(routes, notFound);
        return routerStore
            .goTo('department', { params: { id: 'electronics' } })
            .then((toState) => {
                expect(valueEqual(toState, deptElectronics)).toBe(true);
            });
    });

    test('transitions to the desired state using gotoState()', () => {
        expect.assertions(1);

        const routerStore = new RouterStore(routes, notFound);
        return routerStore.goToState(deptElectronics).then((toState) => {
            expect(valueEqual(toState, deptElectronics)).toBe(true);
        });
    });

    test('transitions to the same state with same params', () => {
        expect.assertions(1);

        const routerStore = new RouterStore(routes, notFound);
        return routerStore
            .goToState(deptElectronics)
            .then(() => routerStore.goToState(deptElectronics))
            .then((toState) => {
                expect(valueEqual(toState, deptElectronics)).toBe(true);
            });
    });

    test('transitions to the same state with different params', () => {
        expect.assertions(1);

        const routerStore = new RouterStore(routes, notFound);
        return routerStore
            .goToState(deptElectronics)
            .then(() => routerStore.goToState(deptMusic))
            .then((toState) => {
                expect(valueEqual(toState, deptMusic)).toBe(true);
            });
    });

    test('transitions to the desired state with query parameters', () => {
        expect.assertions(1);

        const routerStore = new RouterStore(routes, notFound);
        return routerStore.goToState(deptElectronicsQuery).then((toState) => {
            expect(valueEqual(toState, deptElectronicsQuery)).toBe(true);
        });
    });

    test('transitions to notFound state using goToNotFound()', () => {
        const routerStore = new RouterStore(routes, notFound);
        routerStore.goToNotFound();
        expect(valueEqual(routerStore.routerState, notFound)).toBe(true);
    });

    test('transitions to notFound state when toState is unknown', () => {
        const routerStore = new RouterStore(routes, notFound);
        routerStore.goTo('unknown');
        expect(valueEqual(routerStore.routerState, notFound)).toBe(true);
    });

    test('redirects a transition as directed by beforeExit', () => {
        expect.assertions(1);

        const routerStore = new RouterStore(routes, notFound);
        return routerStore
            .goToState(work)
            .then(() => routerStore.goToState(home))
            .then((toState) => {
                expect(valueEqual(toState, gym)).toBe(true);
            });
    });

    test('redirects a transition as directed by beforeEnter', () => {
        expect.assertions(1);

        const routerStore = new RouterStore(routes, notFound);
        return routerStore
            .goToState(home)
            .then(() => routerStore.goToState(mountains))
            .then((toState) => {
                expect(valueEqual(toState, gasStation)).toBe(true);
            });
    });

    test('redirects a transition as directed by onExit', () => {
        expect.assertions(1);

        const routerStore = new RouterStore(routes, notFound);
        return routerStore
            .goToState(sea)
            .then(() => routerStore.goToState(home))
            .then((toState) => {
                expect(valueEqual(toState, gasStation)).toBe(true);
            });
    });

    test('redirects a transition as directed by onEnter', () => {
        expect.assertions(1);

        const routerStore = new RouterStore(routes, notFound);
        return routerStore
            .goToState(home)
            .then(() => routerStore.goToState(dessert))
            .then((toState) => {
                expect(valueEqual(toState, gasStation)).toBe(true);
            });
    });

    test('returns undefined if asked for an unknown route', () => {
        const routerStore = new RouterStore(routes, notFound);
        expect(routerStore.getRoute('unknown')).toBeUndefined();
    });

    test('throws an error if a transition function throws an error', () => {
        const routerStore = new RouterStore(routes, notFound);
        return expect(routerStore.goToState(errorState)).rejects.toThrow();
    });

    test('sets a default initial route', () => {
        const expectedRouterState = createRouterState('__initial__');
        const routerStore = new RouterStore(routes, notFound);
        expect(valueEqual(routerStore.routerState, expectedRouterState)).toBe(
            true
        );
    });

    test('allows to set a specific initial route', () => {
        const routerStore = new RouterStore(routes, notFound, {
            initialState: home,
        });
        expect(valueEqual(routerStore.routerState, home)).toBe(true);
    });

    test('allows to query the current route', () => {
        const expectedRoute = {
            name: 'home',
            pattern: '/',
        };
        const routerStore = new RouterStore(routes, notFound, {
            initialState: home,
        });
        expect(routerStore.getCurrentRoute()).toEqual(expectedRoute);
    });

    test('getNotFoundRoute() throws if notFound route does not exist', () => {
        const routes: Route[] = [{ name: 'home', pattern: '/' }];
        const routerStore = new RouterStore(routes, notFound);
        expect(() => routerStore.getNotFoundRoute()).toThrow();
    });

    test('redirects two times, from vacation, to mountains and finally gasStation', () => {
        const routerStore = new RouterStore(routes, notFound);
        return routerStore.goToState(vacation).then((toState) => {
            expect(valueEqual(toState, gasStation)).toBe(true);
        });
    });

    test('route infinite loop', () => {
        const routerStore = new RouterStore(routes, notFound);
        return routerStore
            .goToState(gym)
            .then(() =>
                expect(routerStore.goToState(startLoop)).rejects.toThrow()
            );
    });
});
