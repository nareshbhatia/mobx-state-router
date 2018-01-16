import { History, Location } from 'history';
import { reaction } from 'mobx';
import { parse } from 'query-string';
import { RouterState, RouterStore, Route, StringMap } from '../router-store';
import { generateUrl } from './generate-url';
import { matchUrl } from './match-url';

export class HistoryAdapter {
    routerStore: RouterStore;
    history: History;

    constructor(routerStore: RouterStore, history: History) {
        this.routerStore = routerStore;
        this.history = history;
        this.goToLocation(this.history.location);

        // Listen for history changes
        this.history.listen(location => this.goToLocation(location));
    }

    goToLocation = (location: Location) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(
                `HistoryAdapter.goToLocation(${JSON.stringify(location)})`
            );
        }

        const routes = this.routerStore.routes;
        let routeFound = false;
        for (let i = 0; i < routes.length; i++) {
            const route = routes[i];
            const params = matchUrl(location.pathname, route.pattern);
            if (params) {
                this.routerStore.goTo({
                    routeName: route.name,
                    params,
                    queryParams: parse(location.search)
                });
                routeFound = true;
                break;
            }
        }

        if (!routeFound) {
            this.routerStore.goToNotFound();
        }
    };

    goBack = () => {
        this.history.goBack();
    };

    observeRouterStateChanges = () => {
        reaction(
            () => this.routerStore.routerState,
            routerState => {
                const url = routerStateToUrl(this.routerStore, routerState);
                if (url !== this.history.location.pathname) {
                    this.history.push(url);
                }
            }
        );
    };
}

export const routerStateToUrl = (
    routerStore: RouterStore,
    routerState: RouterState
): string => {
    const { routeName, params, queryParams } = routerState;
    const route = routerStore.getRoute(routeName);
    return generateUrl(route.pattern, params, queryParams);
};
