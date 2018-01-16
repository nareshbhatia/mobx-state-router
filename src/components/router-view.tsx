import * as React from 'react';
import { observer } from 'mobx-react';
import { RouterStore } from '../router-store';

export interface ViewMap {
    [routeName: string]: React.Component;
}

export interface RouterViewProps {
    routerStore: RouterStore;
    viewMap: ViewMap;
}

@observer
export class RouterView extends React.Component<RouterViewProps, {}> {
    render() {
        const { routerStore: { routerState }, viewMap } = this.props;
        if (process.env.NODE_ENV === 'development') {
            console.log(`RouterView.render() - ${JSON.stringify(routerState)}`);
        }

        const view = viewMap[routerState.routeName];
        return view ? view : null;
    }
}
