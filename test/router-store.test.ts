import { Route, RouterState, RouterStore } from '../src/router-store';

const routes: Route[] = [
    { name: 'home', pattern: '/' },
    { name: 'department', pattern: '/departments/:id' },
    { name: 'gym', pattern: '/gym' },
    { name: 'gasStation', pattern: '/gas-station' },
    { name: 'notFound', pattern: '/not-found' },
    {
        name: 'work',
        pattern: '/work',
        beforeExit: fromState => {
            return Promise.reject(gym);
        }
    },
    {
        name: 'mountains',
        pattern: '/mountains',
        beforeEnter: fromState => {
            return Promise.reject(gasStation);
        }
    },
    {
        name: 'sea',
        pattern: '/sea',
        onExit: fromState => {
            return Promise.reject(gasStation);
        }
    },
    {
        name: 'dessert',
        pattern: '/dessert',
        onEnter: fromState => {
            return Promise.reject(gasStation);
        }
    },
    {
        name: 'errorRoute',
        pattern: '/error',
        onEnter: () => {
            throw new Error('Internal error');
        }
    }
];

const home = new RouterState('home');
const notFound = new RouterState('notFound');
const deptElectronics = new RouterState('department', { id: 'electronics' });
const deptMusic = new RouterState('department', { id: 'music' });
const deptElectronicsQuery = new RouterState(
    'department',
    { id: 'electronics' },
    { q: 'apple' }
);
const gym = new RouterState('gym');
const gasStation = new RouterState('gasStation');
const work = new RouterState('work');
const mountains = new RouterState('mountains');
const sea = new RouterState('sea');
const dessert = new RouterState('dessert');
const errorState = new RouterState('errorRoute');

describe('RouterStore', () => {
    test('transitions to the desired state', () => {
        expect.assertions(1);

        const routerStore = new RouterStore({}, routes, notFound);
        return routerStore.goTo(home).then(toState => {
            expect(toState.isEqual(home)).toBeTruthy();
        });
    });

    test('transitions to the desired state using goto overload (variation 1)', () => {
        expect.assertions(1);

        const routerStore = new RouterStore({}, routes, notFound);
        return routerStore
            .goTo('department', { id: 'electronics' })
            .then(toState => {
                expect(toState.isEqual(deptElectronics)).toBeTruthy();
            });
    });

    test('transitions to the desired state using goto overload (variation 2)', () => {
        expect.assertions(1);

        const routerStore = new RouterStore({}, routes, notFound);
        return routerStore
            .goTo('department', { id: 'electronics' }, {})
            .then(toState => {
                expect(toState.isEqual(deptElectronics)).toBeTruthy();
            });
    });

    test('transitions to the same state with same params', () => {
        expect.assertions(1);

        const routerStore = new RouterStore({}, routes, notFound);
        return routerStore
            .goTo(deptElectronics)
            .then(() => routerStore.goTo(deptElectronics))
            .then(toState => {
                expect(toState.isEqual(deptElectronics)).toBeTruthy();
            });
    });

    test('transitions to the same state with different params', () => {
        expect.assertions(1);

        const routerStore = new RouterStore({}, routes, notFound);
        return routerStore
            .goTo(deptElectronics)
            .then(() => routerStore.goTo(deptMusic))
            .then(toState => {
                expect(toState.isEqual(deptMusic)).toBeTruthy();
            });
    });

    test('transitions to the desired state with query parameters', () => {
        expect.assertions(1);

        const routerStore = new RouterStore({}, routes, notFound);
        return routerStore.goTo(deptElectronicsQuery).then(toState => {
            expect(toState.isEqual(deptElectronicsQuery)).toBeTruthy();
        });
    });

    test('transitions to notFound state', () => {
        const routerStore = new RouterStore({}, routes, notFound);
        routerStore.goToNotFound();
        expect(routerStore.routerState.isEqual(notFound)).toBeTruthy();
    });

    test('rejects a transition as directed by beforeExit', () => {
        expect.assertions(1);

        const routerStore = new RouterStore({}, routes, notFound);
        return routerStore
            .goTo(work)
            .then(() => routerStore.goTo(home))
            .then(toState => {
                expect(toState.isEqual(gym)).toBeTruthy();
            });
    });

    test('rejects a transition as directed by beforeEnter', () => {
        expect.assertions(1);

        const routerStore = new RouterStore({}, routes, notFound);
        return routerStore
            .goTo(home)
            .then(() => routerStore.goTo(mountains))
            .then(toState => {
                expect(toState.isEqual(gasStation)).toBeTruthy();
            });
    });

    test('rejects a transition as directed by onExit', () => {
        expect.assertions(1);

        const routerStore = new RouterStore({}, routes, notFound);
        return routerStore
            .goTo(sea)
            .then(() => routerStore.goTo(home))
            .then(toState => {
                expect(toState.isEqual(gasStation)).toBeTruthy();
            });
    });

    test('rejects a transition as directed by onEnter', () => {
        expect.assertions(1);

        const routerStore = new RouterStore({}, routes, notFound);
        return routerStore
            .goTo(home)
            .then(() => routerStore.goTo(dessert))
            .then(toState => {
                expect(toState.isEqual(gasStation)).toBeTruthy();
            });
    });

    test('throws an error if asked for an unknown route', () => {
        const routerStore = new RouterStore({}, routes, notFound);
        expect(() => routerStore.getRoute('unknown')).toThrow();
    });

    test('throws an error if a transition function throws an error', () => {
        expect.assertions(1);

        const routerStore = new RouterStore({}, routes, notFound);
        return expect(routerStore.goTo(errorState)).rejects.toThrow(
            'toState is undefined'
        );
    });

    test('set initial state', () => {
        const initialState = {
            name: 'home',
            pattern: '/'
        };

        const equalRouterState = {
            routeName: 'home',
            params: {},
            queryParams: {}
        };
        const routerStore = new RouterStore({}, routes, notFound, initialState);
        expect(routerStore.routerState).toMatchObject(equalRouterState);
    });

    test('check default initial state', () => {
        const equalRouterState = {
            routeName: '__initial__',
            params: {},
            queryParams: {}
        };
        const routerStore = new RouterStore({}, routes, notFound);
        expect(routerStore.routerState).toMatchObject(equalRouterState);
    });
});
