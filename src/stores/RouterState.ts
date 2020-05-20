import { StringMap } from '@react-force/utils';

/**
 * Holds the state of the router.
 */
export interface RouterState {
    // Example 'department'
    routeName: string;

    // Example { id: 'electronics' }
    params: StringMap;

    // Example { q: 'apple' } or { items: ['E1', 'E2'] }
    queryParams: { [key: string]: any };

    options: { [key: string]: any };
}

/**
 * createRouterState() is a factory method to create RouterState.
 *
 * - Always use this method to create a new RouterState instance.
 * - Treat RouterState as immutable. If you need a new RouterState, create a fresh one.
 * - RouterState can be serialized and deserialized. This is useful for server-side rendering.
 *
 * @param routeName
 *   Example 'department'
 *
 * @param options (optional) { [key: string]: any }
 *   Any key-value pair that application wants to stuff in RouterState.
 *   The following options have special meaning to mobx-state-router.
 *
 *   params: StringMap
 *     Example { id: 'electronics' }
 *
 *   queryParams: { [key: string]: any }
 *     Example { q: 'apple' } or { items: ['E1', 'E2'] }
 *
 *   replaceHistory: boolean
 *     If true, the router uses history.replace() when transitioning to a new state.
 *     The default is to use history.push().
 */
export const createRouterState = (
    routeName: string,
    options: { [key: string]: any } = {}
) => {
    const defaultOptions = {
        params: {},
        queryParams: {},
        replaceHistory: false,
    };
    const combinedOptions = Object.assign(defaultOptions, options);

    // Separate out params & queryParams - they are fixed properties of RouterState
    const { params, queryParams, ...rest } = combinedOptions;

    return {
        routeName,
        params,
        queryParams,
        options: rest,
    };
};
