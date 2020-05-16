import React, { useContext } from 'react';
import { createRouterState, RouterState, RouterStore } from '../stores';

// ---------- RouterContext ----------
const notFound = createRouterState('notFound');
export const RouterContext = React.createContext<RouterStore>(
    new RouterStore([], notFound)
);

// ---------- useRouterStore ----------
export function useRouterStore() {
    return useContext(RouterContext);
}
