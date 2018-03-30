import { Location } from 'history';
import { parse } from 'query-string';
import { RouterState, RouterStore } from '../router-store';
import { matchUrl } from './match-url';

/**
 * Responsible for driving `RouterState` programmatically instead of the
 * Browser bar. This is useful in server-side rendering scenarios where
 * the user isn’t actually clicking around, so the location never actually
 * changes. Hence, the name `static`.
 */
export class StaticAdapter {
    routerStore: RouterStore;

    constructor(routerStore: RouterStore) {
        this.routerStore = routerStore;
    }

    goToLocation = (location: Location): Promise<RouterState> => {
        if (process.env.NODE_ENV === 'development') {
            console.log(
                `StaticAdapter.goToLocation(${JSON.stringify(location)})`
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
