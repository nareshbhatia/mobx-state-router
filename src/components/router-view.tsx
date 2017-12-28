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
        const {
            routerStore: { routerState: { routeName } },
            viewMap
        } = this.props;
        // console.log(`RouterView rendering ${routeName}`);

        const view = viewMap[routeName];
        return view ? view : null;
    }
}
