import React from 'react';
import { observer } from 'mobx-react';
import { RouterView, useRouterStore } from 'mobx-state-router';
import { Header } from './components';
import { ContentfulPage, GitHubPage, HomePage, NotFoundPage } from './pages';

const viewMap = {
    home: <HomePage />,
    github: <GitHubPage />,
    contentful: <ContentfulPage />,
    notFound: <NotFoundPage />,
};

export const App = observer(() => {
    const routerStore = useRouterStore();

    return (
        <React.Fragment>
            <Header />
            <RouterView routerStore={routerStore} viewMap={viewMap} />
        </React.Fragment>
    );
});
