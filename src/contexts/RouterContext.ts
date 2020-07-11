import React, { useContext } from 'react';
import { RouterStore } from '../stores';

// ---------- RouterContext ----------
export const RouterContext = React.createContext<RouterStore | undefined>(
    undefined
);

// ---------- useRouterStore ----------
export function useRouterStore(): RouterStore {
    const routerStore = useContext(RouterContext);
    if (routerStore === undefined) {
        /* istanbul ignore next */
        throw new Error(
            'useRouterStore must be used within a RouterStoreProvider'
        );
    }
    return routerStore;
}
