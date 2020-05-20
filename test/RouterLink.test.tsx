import React, { ReactNode } from 'react';
import { valueEqual } from '@react-force/utils';
import { fireEvent, render } from '@testing-library/react';
import {
    createRouterState,
    RouterContext,
    RouterLink,
    RouterState,
    RouterStore,
} from '../src';

const routes = [
    { name: 'home', pattern: '/home' },
    { name: 'about', pattern: '/about' },
    { name: 'department', pattern: '/departments/:id' },
    { name: 'items', pattern: '/items' },
    { name: 'item', pattern: '/items/:id/:tabId' },
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

    test('renders activeClassName with default isActive() function', () => {
        const routerStore = new RouterStore(routes, notFound, {
            initialState: home,
        });
        const { getByText } = render(
            <RouterContext.Provider value={routerStore}>
                <RouterLink routeName="home" activeClassName="activeLinkClass">
                    Home
                </RouterLink>
                <RouterLink routeName="about" activeClassName="activeLinkClass">
                    About
                </RouterLink>
            </RouterContext.Provider>
        );
        expect(getByText('Home')).toHaveClass('activeLinkClass');
        expect(getByText('About')).not.toHaveClass();
    });

    test('renders activeClassName with custom isActive() function', () => {
        // Set initial state to summary tab for an item
        const summaryTabState = createRouterState('item', {
            params: {
                id: 'item123', // this would be different for different items
                tabId: 'summary',
            },
        });
        const routerStore = new RouterStore(routes, notFound, {
            initialState: summaryTabState,
        });

        // Custom is active function
        const isActive = (currentState: RouterState, toState: RouterState) =>
            currentState.routeName === toState.routeName &&
            currentState.params.tabId === toState.params.tabId;

        const { getByText } = render(
            <RouterContext.Provider value={routerStore}>
                <RouterLink
                    routeName="item"
                    params={{ id: 'item123', tabId: 'summary' }}
                    activeClassName="activeLinkClass"
                    isActive={isActive}
                >
                    Summary
                </RouterLink>
                <RouterLink
                    routeName="item"
                    params={{ id: 'item123', tabId: 'detail' }}
                    activeClassName="activeLinkClass"
                    isActive={isActive}
                >
                    Detail
                </RouterLink>
            </RouterContext.Provider>
        );
        expect(getByText('Summary')).toHaveClass('activeLinkClass');
        expect(getByText('Detail')).not.toHaveClass();
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
        fireEvent.click(link);
        expect(valueEqual(routerStore.routerState, items)).toBe(true);
    });

    test('does not change RouterState when left-clicked with a modifier key', () => {
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

        // Left-click the link with shift key pressed
        fireEvent.click(link, { shiftKey: true });
        expect(valueEqual(routerStore.routerState, home)).toBe(true);
    });

    test('calls onClick prop when passed in', () => {
        const routerStore = new RouterStore(routes, notFound, {
            initialState: home,
        });
        const handleClick = jest.fn();
        const { getByText } = render(
            <RouterContext.Provider value={routerStore}>
                <RouterLink routeName="items" onClick={handleClick}>
                    Items
                </RouterLink>
            </RouterContext.Provider>
        );
        const link = getByText('Items');
        expect(link).toHaveAttribute('href', '/items');

        // Left-click the link
        fireEvent.click(link);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
