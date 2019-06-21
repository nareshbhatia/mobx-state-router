import { valueEqual } from './utils/value-equal';
import { action, observable } from 'mobx';

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
    [key: string]: string;
}

/**
 * Holds a serialized version of the router state.
 */
export interface JsRouterState {
    routeName: string;
    params?: StringMap;
    queryParams?: { [key: string]: any };
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
     * @param {[key: string]: any} queryParams, e.g. { q: 'apple' } or { items: ['E1', 'E2'] }
     */
    constructor(
        readonly routeName: string,
        readonly params: StringMap = {},
        readonly queryParams: { [key: string]: any } = {}
    ) {}

    static create(jsRouterState: JsRouterState): RouterState {
        const { routeName, params, queryParams } = jsRouterState;
        return new RouterState(routeName, params, queryParams);
    }

    isEqual(other: RouterState): boolean {
        return valueEqual(this, other);
    }
}

export interface TransitionHook {
    (
        fromState: RouterState,
        toState: RouterState,
        routerStore: RouterStore
    ): Promise<void>;
}

export interface ErrorHook {
    (err: Error): any;
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

const INITIAL_ROUTE = {
    name: '__initial__',
    pattern: ''
};

/**
 * Holds the router state. It allows transitioning between states using
 * the `goTo()` method.
 */
export class RouterStore {
    rootStore: any;
    routes: Route[];
    notFoundState: RouterState;
    onError?: ErrorHook;
    @observable.ref
    routerState: RouterState;
    @observable
    isTransitioning: boolean = false;

    constructor(
        rootStore: any,
        routes: Route[],
        notFoundState: RouterState,
        initialState?: JsRouterState
    ) {
        this.rootStore = rootStore;
        this.routes = routes;
        this.notFoundState = notFoundState;

        // Set the initial state
        if (initialState) {
            this.routerState = RouterState.create(initialState);
        } else {
            // Create an artificial route and set initial state to it
            this.routes.push(INITIAL_ROUTE);
            this.routerState = new RouterState(INITIAL_ROUTE.name);
        }
    }

    @action
    hydrate(state: JsRouterState) {
        this.routerState = RouterState.create(state);
    }

    serialize(): JsRouterState {
        return {
            ...this.routerState
        };
    }

    setErrorHook(onError: ErrorHook) {
        this.onError = onError;
    }

    /**
     * Requests a transition to a new state. Note that the actual transition
     * may be different from the requested one based on enter and exit hooks.
     */
    goTo(toState: RouterState): Promise<RouterState>;
    goTo(
        routeName: string,
        params?: StringMap,
        queryParams?: { [key: string]: any }
    ): Promise<RouterState>;
    goTo(
        toStateOrRouteName: RouterState | string,
        params: StringMap = {},
        queryParams: { [key: string]: any } = {}
    ): Promise<RouterState> {
        const toState =
            typeof toStateOrRouteName === 'string'
                ? new RouterState(toStateOrRouteName, params, queryParams)
                : toStateOrRouteName;
        const fromState = this.routerState;
        return this.transition(fromState, toState);
    }

    goToNotFound(): Promise<RouterState> {
        this.setRouterState(this.notFoundState);
        return Promise.resolve(this.notFoundState);
    }

    getRoute(routeName: string): Route {
        for (let i = 0; i < this.routes.length; i++) {
            const route = this.routes[i];
            if (route.name === routeName) {
                return route;
            }
        }

        throw new Error(`Route ${routeName} does not exist`);
    }

    getCurrentRoute(): Route {
        return this.getRoute(this.routerState.routeName);
    }

    /**
     * Requests a transition from fromState to toState. Note that the
     * actual transition may be different from the requested one
     * based on enter and exit hooks.
     */
    private async transition(
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
                // console.log(
                //     `RouterStore.transition(${fromStateStr}):`,
                //     'states are equal, skipping'
                // );
            }
            return toState;
        }

        // /* istanbul ignore if */
        // if (process.env.NODE_ENV === 'development') {
        //     const fromStateStr = JSON.stringify(fromState);
        //     const toStateStr = JSON.stringify(toState);
        //     console.log(
        //         `RouterStore.transition(${fromStateStr}, ${toStateStr})`
        //     );
        // }

        // Get transition hooks from the two states
        const { beforeExit, onExit } = this.getRoute(fromState.routeName);
        const { beforeEnter, onEnter } = this.getRoute(toState.routeName);

        // Call the transition hook chain
        this.isTransitioning = true;

        try {
            if (beforeExit) await beforeExit(fromState, toState, this);
            if (beforeEnter) await beforeEnter(fromState, toState, this);
            if (onExit) await onExit(fromState, toState, this);
            if (onEnter) await onEnter(fromState, toState, this);

            this.setRouterState(toState);
            return toState;
        } catch (err) {
            // If error is an instance of RouterState then go to that state
            if (err instanceof RouterState) {
                const redirectState: RouterState = err;

                if (redirectState.isEqual(toState)) {
                    this.setRouterState(redirectState);
                    return redirectState;
                } else {
                    return this.goTo(redirectState);
                }
            }

            // Else if error hook is specified, call it
            if (this.onError) {
                return this.onError(err);
            }

            // Else handle the error internally
            throw new Error('toState is undefined');
        } finally {
            this.isTransitioning = false;
        }
    }

    @action
    private setRouterState(routerState: RouterState) {
        this.routerState = routerState;
        this.isTransitioning = false;
    }
}
