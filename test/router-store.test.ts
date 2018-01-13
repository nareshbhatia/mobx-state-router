import { isStateEqual, newState, RouterStore } from '../src/router-store';

const routes = [
    { name: 'home', pattern: '/' },
    { name: 'department', pattern: '/departments/:id' },
    { name: 'gym', pattern: '/gym' },
    { name: 'gasStation', pattern: '/gas-station' },
    { name: 'notFound', pattern: '/not-found' },
    {
        name: 'work',
        pattern: '/work',
        beforeExit: fromState => {
            return Promise.reject({
                fromState: fromState,
                toState: gym
            });
        }
    },
    {
        name: 'mountains',
        pattern: '/mountains',
        beforeEnter: fromState => {
            return Promise.reject({
                fromState: fromState,
                toState: gasStation
            });
        }
    },
    {
        name: 'sea',
        pattern: '/sea',
        onExit: fromState => {
            return Promise.reject({
                fromState: fromState,
                toState: gasStation
            });
        }
    },
    {
        name: 'dessert',
        pattern: '/dessert',
        onEnter: fromState => {
            return Promise.reject({
                fromState: fromState,
                toState: gasStation
            });
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

const home = newState('home');
const notFound = newState('notFound');
const deptElectronics = newState('department', { id: 'electronics' });
const deptMusic = newState('department', { id: 'music' });
const deptElectronicsQuery = newState(
    'department',
    { id: 'electronics' },
    { q: 'apple' }
);
const gym = newState('gym');
const gasStation = newState('gasStation');
const work = newState('work');
const mountains = newState('mountains');
const sea = newState('sea');
const dessert = newState('dessert');
const errorState = newState('errorRoute');

describe('RouterStore', () => {
    test('transitions to the desired state', () => {
        expect.assertions(1);

        const routerStore = new RouterStore({}, routes, notFound);
        return routerStore.goTo(home).then(result => {
            expect(isStateEqual(result.toState, home)).toBeTruthy();
        });
    });

    test('transitions to the same state with same params', () => {
        expect.assertions(1);

        const routerStore = new RouterStore({}, routes, notFound);
        return routerStore
            .goTo(deptElectronics)
            .then(() => routerStore.goTo(deptElectronics))
            .then(result => {
                expect(
                    isStateEqual(result.toState, deptElectronics)
                ).toBeTruthy();
            });
    });

    test('transitions to the same state with different params', () => {
        expect.assertions(1);

        const routerStore = new RouterStore({}, routes, notFound);
        return routerStore
            .goTo(deptElectronics)
            .then(() => routerStore.goTo(deptMusic))
            .then(result => {
                expect(isStateEqual(result.toState, deptMusic)).toBeTruthy();
            });
    });

    test('transitions to the desired state with query parameters', () => {
        expect.assertions(1);

        const routerStore = new RouterStore({}, routes, notFound);
        return routerStore.goTo(deptElectronicsQuery).then(result => {
            expect(
                isStateEqual(result.toState, deptElectronicsQuery)
            ).toBeTruthy();
        });
    });

    test('transitions to notFound state', () => {
        const routerStore = new RouterStore({}, routes, notFound);
        routerStore.goToNotFound();
        expect(isStateEqual(routerStore.routerState, notFound)).toBeTruthy();
    });

    test('rejects a transition as directed by beforeExit', () => {
        expect.assertions(1);

        const routerStore = new RouterStore({}, routes, notFound);
        return routerStore
            .goTo(work)
            .then(() => routerStore.goTo(home))
            .then(result => {
                expect(isStateEqual(result.toState, gym)).toBeTruthy();
            });
    });

    test('rejects a transition as directed by beforeEnter', () => {
        expect.assertions(1);

        const routerStore = new RouterStore({}, routes, notFound);
        return routerStore
            .goTo(home)
            .then(() => routerStore.goTo(mountains))
            .then(result => {
                expect(isStateEqual(result.toState, gasStation)).toBeTruthy();
            });
    });

    test('rejects a transition as directed by onExit', () => {
        expect.assertions(1);

        const routerStore = new RouterStore({}, routes, notFound);
        return routerStore
            .goTo(sea)
            .then(() => routerStore.goTo(home))
            .then(result => {
                expect(isStateEqual(result.toState, gasStation)).toBeTruthy();
            });
    });

    test('rejects a transition as directed by onEnter', () => {
        expect.assertions(1);

        const routerStore = new RouterStore({}, routes, notFound);
        return routerStore
            .goTo(home)
            .then(() => routerStore.goTo(dessert))
            .then(result => {
                expect(isStateEqual(result.toState, gasStation)).toBeTruthy();
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
});
