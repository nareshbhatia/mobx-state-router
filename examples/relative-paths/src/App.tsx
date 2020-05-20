import React from 'react';
import { RouterContext, RouterView } from 'mobx-state-router';
import { Header } from './components';
import { initRouter } from './initRouter';
import { AboutPage, HomePage, NotFoundPage } from './pages';

const viewMap = {
    home: <HomePage />,
    about: <AboutPage />,
    notFound: <NotFoundPage />,
};

export const App = () => {
    const routerStore = initRouter();

    return (
        <RouterContext.Provider value={routerStore}>
            <Header />
            <RouterView viewMap={viewMap} />
        </RouterContext.Provider>
    );
};
