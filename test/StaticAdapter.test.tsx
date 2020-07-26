import React, { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { observer } from 'mobx-react';
import { action, decorate, observable, runInAction } from 'mobx';
import {
    createRouterState,
    Route,
    RouterContext,
    RouterStore,
    StaticAdapter,
    useRouterStore,
} from '../src';
import { createLocation } from 'history';

const routes: Route[] = [
    { name: 'home', pattern: '/' },
    {
        name: 'department',
        pattern: '/departments/:id',
    },
    {
        name: 'teslaStore',
        pattern: '/tesla-store',
        beforeEnter: async (_fromState, _toState, routerStore) => {
            const { teslaStore } = routerStore.options;
            await teslaStore.loadSelectedCar();
        },
    },
    { name: 'notFound', pattern: '/not-found' },
];

const notFound = createRouterState('notFound');

const selectedCar = `Tesla Model 3`;
class TeslaStore {
    selectedCar: string = '';

    loadSelectedCar() {
        return new Promise((resolve) => {
            // emulate async load
            setTimeout(() => {
                runInAction(() => {
                    this.selectedCar = selectedCar;
                    resolve();
                });
            }, 500);
        });
    }
}

decorate(TeslaStore, {
    selectedCar: observable,
    loadSelectedCar: action,
});

const teslaStore = new TeslaStore();
const routerStore = new RouterStore(routes, notFound, {
    teslaStore,
});

// ---------- RouterContextProvider ----------
interface RouterContextProviderProps {
    children: ReactNode;
}

export const RouterContextProvider = ({
    children,
}: RouterContextProviderProps) => {
    return (
        <RouterContext.Provider value={routerStore}>
            {children}
        </RouterContext.Provider>
    );
};

// ---------- DepartmentsPage ----------
const DepartmentsPage = observer(() => {
    const routerStore = useRouterStore();
    const { routerState, options } = routerStore;
    const { routeName, params } = routerState;
    const { selectedCar } = options.teslaStore;
    return (
        <div>
            {params.id === 'dept1' ? (
                <div data-testid="tab">Dept 1 Content</div>
            ) : null}
            {routeName === 'notFound' ? (
                <div data-testid="tab">Not Found</div>
            ) : null}
            {routeName === 'teslaStore' ? (
                <div data-testid="tab">{selectedCar}</div>
            ) : null}
        </div>
    );
});

// ---------- Tests ----------

describe('StaticAdapter', () => {
    test('goes correctly to a known location', async () => {
        const staticAdapter = new StaticAdapter(routerStore);
        await staticAdapter.goToLocation(createLocation('/departments/dept1'));
        const { getByTestId } = render(
            <RouterContextProvider>
                <DepartmentsPage />
            </RouterContextProvider>
        );
        expect(getByTestId('tab').textContent).toBe('Dept 1 Content');
    });

    test('goes to Not Found if asked to go to an unknown location', async () => {
        const staticAdapter = new StaticAdapter(routerStore);
        await staticAdapter.goToLocation(createLocation('/unknown/dept1'));
        const { getByTestId } = render(
            <RouterContextProvider>
                <DepartmentsPage />
            </RouterContextProvider>
        );
        expect(getByTestId('tab').textContent).toBe('Not Found');
    });

    test('runs beforeEnter hook before going to target location', async () => {
        const staticAdapter = new StaticAdapter(routerStore);
        await staticAdapter.goToLocation(createLocation('/tesla-store'));
        const { getByTestId } = render(
            <RouterContextProvider>
                <DepartmentsPage />
            </RouterContextProvider>
        );
        expect(getByTestId('tab').textContent).toBe(selectedCar);
    });
});
