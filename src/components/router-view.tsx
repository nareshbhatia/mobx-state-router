import * as React from 'react';
import { observer } from 'mobx-react';
import { RouterStore } from '../router-store';

export interface ViewMap {
    [routeName: string]: React.ReactNode;
}

export interface RouterViewProps {
    routerStore: RouterStore;
    viewMap: ViewMap;
}

/**
 * Watches the router state and instantiates the associated UI component.
 * It expects two props: the `routerStore` and a `viewMap`. The `viewMap`
 * is a simple mapping from `routeNames` to React components.
 */
@observer
export class RouterView extends React.Component<RouterViewProps, {}> {
    render() {
        const {
            routerStore: { routerState },
            viewMap
        } = this.props;
        // if (process.env.NODE_ENV === 'development') {
        //     console.log(`RouterView.render() - ${JSON.stringify(routerState)}`);
        // }

        const view = viewMap[routerState.routeName];
        return view ? view : null;
    }
}
