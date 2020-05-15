import { StringMap } from '@react-force/utils';

/**
 * Holds the state of the router.
 * Always use createRouterState to create an instance.
 * Treat RouterState as immutable. If you need a new state, create a fresh one.
 * RouterState can be serialized and deserialized (useful for server-side rendering)
 */
export interface RouterState {
    // Example 'department'
    routeName: string;

    // Example { id: 'electronics' }
    params: StringMap;

    // Example { q: 'apple' } or { items: ['E1', 'E2'] }
    queryParams: { [key: string]: any };

    // Use history.replace() when transitioning to a new state.
    // The default is history.push().
    replaceHistory: boolean;
}

export const createRouterState = (
    routeName: string,
    options: Partial<RouterState> = {}
) => {
    const defaults = {
        routeName,
        params: {},
        queryParams: {},
        replaceHistory: false,
    };
    return Object.assign(defaults, options);
};
