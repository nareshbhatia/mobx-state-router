import { parse } from 'query-string';
import { Location } from 'history';
import { createRouterState, Route, RouterState } from '../stores';
import { matchUrl } from './matchUrl';

/*
 * Create a RouterState that matches the specified URL.
 *
 * Used by HistoryAdapter & StaticAdapter to convert the received URL
 * into a RouterState.
 */
export const createMatchingRouterState = (
    location: Location,
    routes: Route[],
    queryParseOptions?: any
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
        const queryParams = parse(location.search, queryParseOptions);
        return createRouterState(matchingRoute.name, {
            params,
            queryParams,
        });
    }
};
