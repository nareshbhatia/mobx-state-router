import * as React from 'react';
import { observer } from 'mobx-react';
import { RouterStore } from '../router-store';

export interface RouterViewProps {
    routerStore: RouterStore;
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
            routerStore: { activeView }
        } = this.props;
        // if (process.env.NODE_ENV === 'development') {
        //     console.log(`RouterView.render() - ${JSON.stringify(routerState)}`);
        // }

        return activeView;
    }
}
