import { fireEvent, render } from '@testing-library/react';
import { observer } from 'mobx-react-lite';
import React from 'react';
import {
    createRouterState,
    RouterContext,
    RouterStore,
    useRouterStore,
} from '../src';

const routes = [
    { name: 'home', pattern: '/' },
    { name: 'department', pattern: '/departments/:id' },
    { name: 'notFound', pattern: '/not-found' },
];

const notFound = createRouterState('notFound');
const dept1 = createRouterState('department', { params: { id: 'dept1' } });

const DepartmentsPage = observer(() => {
    const routerStore = useRouterStore();
    const { routerState } = routerStore;
    const { params } = routerState;
    return (
        <div>
            <button
                name="dept1-button"
                onClick={() => {
                    routerStore.goTo('department', {
                        params: { id: 'dept1' },
                    });
                }}
            >
                Go to Department 1
            </button>
            <button
                name="dept2-button"
                onClick={() => {
                    routerStore.goTo('department', {
                        params: { id: 'dept2' },
                    });
                }}
            >
                Go to Department 2
            </button>

            {params.id === 'dept1' && (
                <div data-testid="content">Dept 1 Content</div>
            )}
            {params.id === 'dept2' && (
                <div data-testid="content">Dept 2 Content</div>
            )}
        </div>
    );
});

test('Calling routerStore.goTo() in a component changes the router state', () => {
    const routerStore = new RouterStore(routes, notFound, {
        initialState: dept1,
    });
    const { getByTestId, getByText } = render(
        <RouterContext.Provider value={routerStore}>
            <DepartmentsPage />
        </RouterContext.Provider>
    );
    expect(getByTestId('content').textContent).toBe('Dept 1 Content');

    // Left-click the "Department 2" button
    fireEvent.click(getByText('Go to Department 2'), { button: 0 });
    expect(getByTestId('content').textContent).toBe('Dept 2 Content');
});
