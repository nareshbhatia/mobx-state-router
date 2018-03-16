// TODO: How to get the following imports working without allowSyntheticDefaultImports
// import find from 'lodash/find';
// import isEqual from 'lodash/isEqual';
import * as _ from 'lodash';
import { action, observable, toJS } from 'mobx';

/**
 * A map from string to string (key-value pairs). Based on:
 * https://stackoverflow.com/questions/13631557/typescript-objects-as-dictionary-types-as-in-c-sharp
 *
 * Example:
 * {
 *     id: 'electronics',
 *     category: 'computers'
 * }
 */
export interface StringMap {
    [param: string]: string;
}

/**
 * Holds the state of the router. Always use the constructor to create
 * an instance. Once an instance is created, don't mutate it - create a
 * fresh instance instead.
 */
export class RouterState {
    /**
     * Creates RouterState
     * @param {string} routeName, e.g. 'department'
     * @param {StringMap} params, e.g. { id: 'electronics' }
     * @param {Object} queryParams, e.g. { q: 'apple' } or { items: ['E1', 'E2'] }
     */
    constructor(
        readonly routeName: string,
        readonly params: StringMap = {},
        readonly queryParams: Object = {}
    ) {}

    isEqual(other: RouterState): boolean {
        return (
            this.routeName === other.routeName &&
            _.isEqual(this.params, other.params) &&
            _.isEqual(this.queryParams, other.queryParams)
        );
    }
}

export interface TransitionHook {
    (
        fromState: RouterState,
        toState: RouterState,
        routerStore: RouterStore
    ): Promise<void>;
}

/**
 * A `Route` consists of a name, a URL matching pattern and optional
 * enter/exit hooks. The `RouterStore` is initialized with an array
 * of routes which it uses to transition between states.
 */
export interface Route {
    name: string; // e.g. 'department'
    pattern: string; // e.g. '/departments/:id'
    beforeExit?: TransitionHook;
    beforeEnter?: TransitionHook;
    onExit?: TransitionHook;
    onEnter?: TransitionHook;
}

export interface InitialState {
    name: string;
    pattern: string;
}

const INITIAL_ROUTE_NAME = '__initial__';
const INITIAL_ROUTE_PATTERN = '';

/**
 * Holds the router state. It allows transitioning between states using
 * the `goTo()` method.
 */
export class RouterStore {
    rootStore: any;
    routes: Route[];
    notFoundState: RouterState;
    @observable.ref routerState: RouterState;

    constructor(
        rootStore: any,
        routes: Route[],
        notFoundState: RouterState,
        initialState?: InitialState
    ) {
        this.rootStore = rootStore;
        this.routes = routes;
        this.notFoundState = notFoundState;

        // if not initial state, set default
        if (!initialState) {
            initialState = {
                name: INITIAL_ROUTE_NAME,
                pattern: INITIAL_ROUTE_PATTERN
            };
        }

        // Set initial state to an internal initial state
        this.routes.push(initialState);
        this.routerState = new RouterState(initialState.name);
    }

    /**
     * Requests a transition to a new state. Note that the actual transition
     * may be different from the requested one based on enter and exit hooks.
     */
    goTo(toState: RouterState): Promise<RouterState>;
    goTo(
        routeName: string,
        params?: StringMap,
        queryParams?: Object
    ): Promise<RouterState>;
    goTo(
        toStateOrRouteName: RouterState | string,
        params: StringMap = {},
        queryParams: Object = {}
    ): Promise<RouterState> {
        const toState =
            toStateOrRouteName instanceof RouterState
                ? toStateOrRouteName
                : new RouterState(toStateOrRouteName, params, queryParams);
        const fromState = this.routerState;
        return this.transition(fromState, toState);
    }

    goToNotFound() {
        this.setRouterState(this.notFoundState);
    }

    getRoute(routeName: string): Route {
        const route = _.find(this.routes, { name: routeName });
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
        // If fromState = toState, do nothing
        // This is important to avoid infinite loops caused by RouterStore.goTo()
        // triggering a change in history, which in turn causes HistoryAdapter
        // to call RouterStore.goTo().
        if (fromState.isEqual(toState)) {
            /* istanbul ignore if */
            if (process.env.NODE_ENV === 'development') {
                const fromStateStr = JSON.stringify(fromState);
                console.log(
                    `RouterStore.transition(${fromStateStr}):`,
                    'states are equal, skipping'
                );
            }
            return Promise.resolve(toState);
        }

        /* istanbul ignore if */
        if (process.env.NODE_ENV === 'development') {
            const fromStateStr = JSON.stringify(fromState);
            const toStateStr = JSON.stringify(toState);
            console.log(
                `RouterStore.transition(${fromStateStr}, ${toStateStr})`
            );
        }

        // Get transition hooks from the two states
        const { beforeExit, onExit } = this.getRoute(fromState.routeName);
        const { beforeEnter, onEnter } = this.getRoute(toState.routeName);

        // Call the transition hook chain
        return (
            [beforeExit, beforeEnter, onExit, onEnter]
                .reduce(
                    (promise: Promise<void>, hook) =>
                        hook
                            ? promise.then(() => hook(fromState, toState, this))
                            : promise,
                    Promise.resolve()
                )

                // Handle successful resolution from the promise chain
                .then(() => {
                    this.setRouterState(toState);
                    return toState;
                })

                // Handle rejection from the promise chain
                .catch(redirectState => {
                    if (redirectState instanceof RouterState === false) {
                        throw new Error('toState is undefined');
                    }
                    this.setRouterState(redirectState);
                    return redirectState;
                })
        );
    }

    @action
    private setRouterState(routerState: RouterState) {
        this.routerState = routerState;
    }
}
