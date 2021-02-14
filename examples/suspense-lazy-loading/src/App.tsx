import React, {
    ComponentType,
    lazy,
    LazyExoticComponent,
    Suspense,
} from 'react';
import { observer } from 'mobx-react-lite';
import { useRouterStore } from 'mobx-state-router';
import { Header } from './components';

const viewMap: { [key: string]: LazyExoticComponent<ComponentType<any>> } = {
    home: lazy(() => import('./pages/HomePage')),
    github: lazy(() => import('./pages/GithubPage')),
    notFound: lazy(() => import('./pages/NotFoundPage')),
};

export const App = observer(() => {
    const routerStore = useRouterStore();
    const { routeName } = routerStore.routerState;
    const View = viewMap[routeName];
    if (!View) {
        return null;
    }

    return (
        <Suspense fallback={<div>Loading {routeName} component</div>}>
            <Header />
            <View />
        </Suspense>
    );
});
