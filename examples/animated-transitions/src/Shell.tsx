import React from 'react';
import { observer } from 'mobx-react';
import { useRouterStore, ViewMap } from 'mobx-state-router';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Header } from './components';
import { AboutPage, HomePage, NotFoundPage } from './pages';
import './Shell.css';

const viewMap: ViewMap = {
    home: <HomePage />,
    about: <AboutPage />,
    notFound: <NotFoundPage />,
};

export const Shell = observer(() => {
    const routerStore = useRouterStore();
    const routeName = routerStore.routerState.routeName;
    const view = viewMap[routeName];

    return (
        <React.Fragment>
            <Header />
            <div className="content-holder">
                <TransitionGroup component={null}>
                    <CSSTransition
                        key={routerStore.routerState.routeName}
                        timeout={250}
                        classNames="fade"
                    >
                        {view}
                    </CSSTransition>
                </TransitionGroup>
            </div>
        </React.Fragment>
    );
});
