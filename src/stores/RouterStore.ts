import Debug from 'debug';
import { action, makeObservable, observable } from 'mobx';
import { createRouterState, RouterState } from './RouterState';
import { TransitionState } from './TransitionState';

const debugSetState = Debug('msr:setRouterState');

/**
 * A function called when transitioning from fromState to toState.
 * If it returns a RouterState, then the router redirects to that state.
 * If it returns a void, then the router proceeds to the next transition hook.
 * When no more hooks are left, it simply navigates to toState.
 */
export type TransitionHook = (
    fromState: RouterState,
    toState: RouterState,
    routerStore: RouterStore
) => Promise<RouterState | void>;

/**
 * A `Route` consists of a name, a URL matching pattern and optional
 * enter/exit hooks. The `RouterStore` is initialized with an array
 * of routes which it uses to transition between states.
 *
 * Note: Don't destructure routes to allow implementing them as classes.
 * See https://github.com/nareshbhatia/mobx-state-router/issues/74
 */
export interface Route {
    /** route name, e.g. 'department' */
    name: string;

    /** route matching pattern, e.g. '/departments/:id' */
    pattern: string;

    /**
     * Alternate route matching patterns. These support legacy routes
     * and go one way only, from browser location to router state.
     */
    altPatterns?: Array<string>;

    // Enter/exit hooks
    beforeExit?: TransitionHook;
    beforeEnter?: TransitionHook;
    onExit?: TransitionHook;
    onEnter?: TransitionHook;
}

const InitialRouteName = '__initial__';
const InitialRoute = {
    name: InitialRouteName,
    pattern: '',
};
const InitialRouterState = createRouterState(InitialRouteName);

/**
 * Holds the router state. It allows transitioning between states using
 * `goTo` methods.
 */
export class RouterStore {
    routes: Route[];
    notFoundState: RouterState;
    routerState: RouterState;
    options: { [key: string]: any };

    /**
     * @param routes: Route[]
     *   Any array of routes that will be used by the router
     *   to transition between states.
     *
     * @param notFoundState: RouterState
     *   The state the router will transition to if it does not
     *   know about the requested goTo state.
     *
     * @param options (optional) { [key: string]: any }
     *   Any key-value pair that application wants to stuff in RouterStore.
     *   The following options have special meaning to mobx-state-router.
     *
     *   initialState: RouterState
     *     The initial state of the router. If not specified, the router
     *     will be initialized to an internal default state and will wait
     *     for history to drive the next state.
     *
     *   queryParseOptions: any
     *     Options for parsing query strings. These are passed directly to
     *     the [query-string](https://github.com/sindresorhus/query-string)
     *     library that is used internally.
     *
     *   queryStringifyOptions: any
     *     Options for stringifying query params. These are passed directly to
     *     the [query-string](https://github.com/sindresorhus/query-string)
     *     library that is used internally.
     */
    constructor(
        routes: Route[],
        notFoundState: RouterState,
        options: { [key: string]: any } = {}
    ) {
        makeObservable(this, {
            routerState: observable.ref,
            setRouterState: action,
        });

        // Set routes and push an internal route for the default state
        this.routes = routes;
        this.routes.push(InitialRoute);

        // Set options
        const defaultOptions = {
            initialState: InitialRouterState,
        };
        this.options = Object.assign(defaultOptions, options);

        // Set states
        this.notFoundState = notFoundState;
        this.routerState = this.options.initialState;
    }

    setRouterState(routerState: RouterState) {
        debugSetState('%o', routerState);
        this.routerState = routerState;
    }

    /**
     * Requests a transition to a new state. Note that the actual transition
     * may be different from the requested one based on enter and exit hooks.
     * Internally calls createRouterState() with the supplied parameters to
     * construct the target state.
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
    goTo(
        routeName: string,
        options: { [key: string]: any } = {}
    ): Promise<RouterState> {
        const toState = createRouterState(routeName, options);
        const fromState = this.routerState;
        return this.transition(fromState, toState);
    }

    goToState(toState: RouterState): Promise<RouterState> {
        const fromState = this.routerState;
        return this.transition(fromState, toState);
    }

    goToNotFound(): Promise<RouterState> {
        this.setRouterState(this.notFoundState);
        return Promise.resolve(this.notFoundState);
    }

    getRoute(routeName: string): Route | undefined {
        return this.routes.find((route) => route.name === routeName);
    }

    getCurrentRoute(): Route | undefined {
        return this.getRoute(this.routerState.routeName);
    }

    getNotFoundRoute(): Route {
        const routeName = this.notFoundState.routeName;
        const route = this.getRoute(routeName);
        if (!route) {
            throw new Error(`Route ${routeName} does not exist`);
        }
        return route;
    }

    /**
     * Requests a transition from fromState to toState. Note that the
     * actual transition may be different from the requested one
     * based on enter and exit hooks.
     */
    private transition(
        fromState: RouterState,
        toState: RouterState
    ): Promise<RouterState> {
        // Get transition hooks from the two states
        const transitionState = new TransitionState(this, fromState);
        return transitionState.resolve(toState);
    }
}
