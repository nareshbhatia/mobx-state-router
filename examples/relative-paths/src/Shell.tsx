import React from 'react';
import { observer } from 'mobx-react';
import { RouterView, useRouterStore } from 'mobx-state-router';
import { Header } from './components';
import { AboutPage, HomePage, NotFoundPage } from './pages';

const viewMap = {
    home: <HomePage />,
    about: <AboutPage />,
    notFound: <NotFoundPage />,
};

export const Shell = observer(() => {
    const routerStore = useRouterStore();

    return (
        <React.Fragment>
            <Header />
            <RouterView routerStore={routerStore} viewMap={viewMap} />
        </React.Fragment>
    );
});
