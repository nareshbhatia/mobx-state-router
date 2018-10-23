import * as React from 'react';
import { observer } from 'mobx-react';
import { RouterStore } from '../router-store';

export interface RouterViewProps {
    routerStore: RouterStore;
}

/**
 * Watches the router state and instantiates the associated UI component.
 * It expects the `routerStore` as prop.
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
