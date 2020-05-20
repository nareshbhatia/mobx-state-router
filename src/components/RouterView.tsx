import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import { useRouterStore } from '../contexts';

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
export const RouterView = observer(({ viewMap }: RouterViewProps) => {
    const routerStore = useRouterStore();
    const { routerState } = routerStore;
    // if (process.env.NODE_ENV === 'development') {
    //     console.log(`RouterView.render() - ${JSON.stringify(routerState)}`);
    // }

    const view = viewMap[routerState.routeName];
    return view ? <Fragment>{view}</Fragment> : null;
});
