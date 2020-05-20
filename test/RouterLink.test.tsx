import React, { ReactNode } from 'react';
import { valueEqual } from '@react-force/utils';
import { fireEvent, render } from '@testing-library/react';
import {
    createRouterState,
    RouterContext,
    RouterLink,
    RouterStore,
} from '../src';

const routes = [
    { name: 'home', pattern: '/home' },
    { name: 'department', pattern: '/departments/:id' },
    { name: 'items', pattern: '/items' },
    { name: 'notFound', pattern: '/not-found' },
];

const home = createRouterState('home');
const items = createRouterState('items');
const notFound = createRouterState('notFound');

// ---------- RouterContextProvider ----------
interface RouterContextProviderProps {
    children: ReactNode;
}

const RouterContextProvider = ({ children }: RouterContextProviderProps) => {
    const routerStore = new RouterStore(routes, notFound);
    return (
        <RouterContext.Provider value={routerStore}>
            {children}
        </RouterContext.Provider>
    );
};

// ---------- Tests ----------

describe('RouterLink', () => {
    test('renders simple routes, e.g. /home', () => {
        const { getByText } = render(
            <RouterContextProvider>
                <RouterLink routeName="home">Home</RouterLink>
            </RouterContextProvider>
        );
        expect(getByText('Home')).toHaveAttribute('href', '/home');
    });

    test('renders routes with params, e.g. /departments/:id', () => {
        const { getByText } = render(
            <RouterContextProvider>
                <RouterLink
                    routeName="department"
                    params={{ id: 'electronics' }}
                >
                    Electronics
                </RouterLink>
            </RouterContextProvider>
        );
        expect(getByText('Electronics')).toHaveAttribute(
            'href',
            '/departments/electronics'
        );
    });

    test('renders routes with queryParams, e.g. /items?q=apple', () => {
        const { getByText } = render(
            <RouterContextProvider>
                <RouterLink routeName="items" queryParams={{ q: 'apple' }}>
                    Apple
                </RouterLink>
            </RouterContextProvider>
        );
        expect(getByText('Apple')).toHaveAttribute('href', '/items?q=apple');
    });

    test('renders with blank className when no class names are supplied', () => {
        const { getByText } = render(
            <RouterContextProvider>
                <RouterLink routeName="home">Home</RouterLink>
            </RouterContextProvider>
        );
        expect(getByText('Home')).not.toHaveClass();
    });

    test('renders with className when className is supplied', () => {
        const { getByText } = render(
            <RouterContextProvider>
                <RouterLink routeName="home" className="linkClass">
                    Home
                </RouterLink>
            </RouterContextProvider>
        );
        expect(getByText('Home')).toHaveClass('linkClass');
    });

    test('does not render activeClassName when link is inactive', () => {
        const { getByText } = render(
            <RouterContextProvider>
                <RouterLink
                    routeName="home"
                    className="linkClass"
                    activeClassName="activeLinkClass"
                >
                    Home
                </RouterLink>
            </RouterContextProvider>
        );
        expect(getByText('Home')).toHaveClass('linkClass');
    });

    test('renders activeClassName when link is active', () => {
        const routerStore = new RouterStore(routes, notFound, {
            initialState: home,
        });
        const { getByText } = render(
            <RouterContext.Provider value={routerStore}>
                <RouterLink
                    routeName="home"
                    className="linkClass"
                    activeClassName="activeLinkClass"
                >
                    Home
                </RouterLink>
            </RouterContext.Provider>
        );
        expect(getByText('Home')).toHaveClass('linkClass', 'activeLinkClass');
    });

    test('changes RouterState when left-clicked', () => {
        const routerStore = new RouterStore(routes, notFound, {
            initialState: home,
        });
        const { getByText } = render(
            <RouterContext.Provider value={routerStore}>
                <RouterLink routeName="items">Items</RouterLink>
            </RouterContext.Provider>
        );
        const link = getByText('Items');
        expect(link).toHaveAttribute('href', '/items');

        // Left-click the link
        fireEvent.click(link, { button: 0 });
        expect(valueEqual(routerStore.routerState, items)).toBe(true);
    });

    test('does not change RouterState when right-clicked', () => {
        const routerStore = new RouterStore(routes, notFound, {
            initialState: home,
        });
        const { getByText } = render(
            <RouterContext.Provider value={routerStore}>
                <RouterLink routeName="items">Items</RouterLink>
            </RouterContext.Provider>
        );
        const link = getByText('Items');
        expect(link).toHaveAttribute('href', '/items');

        // Right-click the link
        // TODO: right-click (button: 2) is not working, so use button: 1.
        // See https://github.com/testing-library/dom-testing-library/issues/584
        fireEvent.click(link, { button: 1 });
        expect(valueEqual(routerStore.routerState, home)).toBe(true);
    });

    test('calls onClick prop when passed in', () => {
        const handleClick = jest.fn();
        const { getByText } = render(
            <RouterContextProvider>
                <RouterLink routeName="home" onClick={handleClick}>
                    Home
                </RouterLink>
            </RouterContextProvider>
        );
        const link = getByText('Home');
        expect(link).toHaveAttribute('href', '/home');

        // Left-click the link
        fireEvent.click(link, { button: 0 });
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
