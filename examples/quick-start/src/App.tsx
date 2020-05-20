import React from 'react';
import { RouterContext, RouterView } from 'mobx-state-router';
import { initRouter } from './initRouter';
import { viewMap } from './viewMap';

export const App = () => {
    const routerStore = initRouter();

    return (
        <RouterContext.Provider value={routerStore}>
            <RouterView viewMap={viewMap} />
        </RouterContext.Provider>
    );
};
