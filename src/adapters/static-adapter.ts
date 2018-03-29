import { parse } from 'query-string';
import { RouterState, RouterStore } from '../router-store';
import { matchUrl } from './match-url';

/**
 * Responsible for keeping the `RouterState` without sync with the Browser bar.
 */
export class StaticAdapter {
    routerStore: RouterStore;

    constructor(routerStore: RouterStore) {
        this.routerStore = routerStore;
    }

    goToLocation = (location: Location): Promise<RouterState> => {
        if (process.env.NODE_ENV === 'development') {
            console.log(
                `HistoryAdapter.goToLocation(${JSON.stringify(location)})`
            );
        }

        // Find the matching route
        const routes = this.routerStore.routes;
        let matchingRoute = null;
        let params = undefined;
        for (let i = 0; i < routes.length; i++) {
            const route = routes[i];
            params = matchUrl(location.pathname, route.pattern);
            if (params) {
                matchingRoute = route;
                break;
            }
        }

        if (matchingRoute) {
            return this.routerStore.goTo(
                new RouterState(
                    matchingRoute.name,
                    params,
                    parse(location.search)
                )
            );
        } else {
            return this.routerStore.goToNotFound();
        }
    };
}
