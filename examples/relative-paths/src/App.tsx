import React from 'react';
import { RouterContext } from 'mobx-state-router';
import { initRouter } from './initRouter';
import { Shell } from './Shell';

export const App = () => {
    const routerStore = initRouter();

    return (
        <RouterContext.Provider value={routerStore}>
            <Shell />
        </RouterContext.Provider>
    );
};
