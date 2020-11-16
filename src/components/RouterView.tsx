import Debug from 'debug';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useRouterStore } from '../contexts';

const debug = Debug('msr:RouterView');

export interface ViewMap {
    [routeName: string]: React.ReactNode;
}

export interface RouterViewProps {
    viewMap: ViewMap;
}

/**
 * Watches the router state and instantiates the associated UI component.
 * It expects two props: the `routerStore` and a `viewMap`. The `viewMap`
 * is a simple mapping from `routeNames` to React components.
 */
export const RouterView: React.FC<RouterViewProps> = observer(({ viewMap }) => {
    const routerStore = useRouterStore();
    const { routerState } = routerStore;
    debug('render %o', routerState);

    const view = viewMap[routerState.routeName];
    return view ? <>{view}</> : null;
});
