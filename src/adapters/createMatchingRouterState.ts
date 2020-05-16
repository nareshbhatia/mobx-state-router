import { parse } from 'query-string';
import { Location } from 'history';
import { createRouterState, Route, RouterState } from '../stores';
import { matchUrl } from './matchUrl';

/*
 * Create a RouterState that matches the specified URL.
 *
 * Can be used to generate the initial routerState when initialising the RouterStore.
 * For example:
 *    const history = createBrowserHistory();
 *    routerStore = new RouterStore(
 *      routes,
 *      notFound,
 *      createMatchingRouterState(history.location, routes)
 *    );
 */
export const createMatchingRouterState = (
    location: Location,
    routes: Route[]
): RouterState | undefined => {
    // Find the matching route
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
        return createRouterState(matchingRoute.name, {
            params,
            queryParams: parse(location.search),
        });
    }
};
