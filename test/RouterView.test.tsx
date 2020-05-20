import React, { ReactNode } from 'react';
import { render } from '@testing-library/react';
import {
    createRouterState,
    RouterContext,
    RouterView,
    RouterStore,
} from '../src';

const routes = [
    { name: 'home', pattern: '/home' },
    { name: 'profile', pattern: '/profile' },
    { name: 'notFound', pattern: '/not-found' },
];

const home = createRouterState('home');
const notFound = createRouterState('notFound');
const unknown = createRouterState('unknown');

// ---------- RouterContextProvider ----------
interface RouterContextProviderProps {
    children: ReactNode;
}

const RouterContextProvider = ({ children }: RouterContextProviderProps) => {
    const routerStore = new RouterStore(routes, notFound, {
        initialState: home,
    });
    return (
        <RouterContext.Provider value={routerStore}>
            {children}
        </RouterContext.Provider>
    );
};

// ---------- Pages ----------
const HomePage = () => <div data-testid="home-page">Home</div>;
const ProfilePage = () => <div data-testid="profile-page">Profile</div>;
const NotFoundPage = () => <div data-testid="notfound-page">Not Found</div>;

const viewMap = {
    home: <HomePage />,
    profile: <ProfilePage />,
    notFound: <NotFoundPage />,
};

// ---------- Tests ----------

describe('RouterView', () => {
    test('renders the view associated with the current route', () => {
        const routerStore = new RouterStore(routes, notFound, {
            initialState: home,
        });

        const { getByTestId } = render(
            <RouterContext.Provider value={routerStore}>
                <RouterView viewMap={viewMap} />
            </RouterContext.Provider>
        );
        expect(getByTestId('home-page').textContent).toBe('Home');
    });

    test('renders null if current route is unknown', () => {
        const routerStore = new RouterStore(routes, notFound, {
            initialState: unknown,
        });

        const { container } = render(
            <RouterContext.Provider value={routerStore}>
                <RouterView viewMap={viewMap} />
            </RouterContext.Provider>
        );
        expect(container.firstChild).toBeNull();
    });
});
