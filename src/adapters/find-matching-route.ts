import { JsRouterState, Route } from '../router-store';
import { matchUrl } from './match-url';
import { parse } from 'query-string';
import { Location } from 'history';

/*
 * Find a route that matches the URL to a pattern and extracts the components.
 * 
 * Can be used to generate the initial routerState when initialising the RouterStore.
 *  e.g. 
 *    const history = createBrowserHistory();
      routerStore = new RouterStore(
        rootStore,
        routes,
        notFound,
        findMatchingRoute(history.location, routes)
    );
 */
export const findMatchingRoute = (
    location: Location,
    routes: Route[]
): JsRouterState | undefined => {
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
        return {
            routeName: matchingRoute.name,
            params,
            queryParams: parse(location.search)
        };
    }
};
