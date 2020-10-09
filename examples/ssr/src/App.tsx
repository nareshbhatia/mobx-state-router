import React from 'react';
import { observer } from 'mobx-react-lite';
import { RouterView } from 'mobx-state-router';
import { Header } from './components';
import { ContentfulPage, GitHubPage, HomePage, NotFoundPage } from './pages';

const viewMap = {
    home: <HomePage />,
    github: <GitHubPage />,
    contentful: <ContentfulPage />,
    notFound: <NotFoundPage />,
};

export const App = observer(() => {
    return (
        <React.Fragment>
            <Header />
            <RouterView viewMap={viewMap} />
        </React.Fragment>
    );
});
