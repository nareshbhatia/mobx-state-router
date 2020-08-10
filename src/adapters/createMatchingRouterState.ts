import { Location } from 'history';
import { parse } from 'query-string';
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
    for (let rIndex = 0; rIndex < routes.length; rIndex++) {
        const route = routes[rIndex];

        // Combine primary and alternate patterns into a single array.
        // Primary should always be at the beginning of the array.
        const patterns = route.altPatterns
            ? [route.pattern].concat(route.altPatterns)
            : [route.pattern];

        // Match URL to the patterns
        for (let pIndex = 0; pIndex < patterns.length; pIndex++) {
            const params = matchUrl(location.pathname, patterns[pIndex]);
            if (params) {
                const queryParams = parse(location.search, queryParseOptions);
                return createRouterState(route.name, {
                    params,
                    queryParams,
                });
            }
        }
    }

    return undefined;
};
