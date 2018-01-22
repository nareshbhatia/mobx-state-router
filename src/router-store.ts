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

export interface TransitionResult {
    fromState: RouterState;
    toState: RouterState;
}

export interface TransitionFunction {
    (
        fromState: RouterState,
        toState: RouterState,
        routerStore: RouterStore
    ): Promise<TransitionResult>;
}

/**
 * A `Route` consists of a name, a URL matching pattern and optional
 * enter/exit hooks. The `RouterStore` is initialized with an array
 * of routes which it uses to transition between states.
 */
export interface Route {
    name: string; // e.g. 'department'
    pattern: string; // e.g. '/departments/:id'
    beforeExit?: TransitionFunction;
    beforeEnter?: TransitionFunction;
    onExit?: TransitionFunction;
    onEnter?: TransitionFunction;
}

const INITIAL_ROUTE_NAME = '__initial__';

const happyTransition = (fromState: RouterState, toState: RouterState) => {
    return Promise.resolve({ fromState: fromState, toState: toState });
};

/**
 * Holds the router state. It allows transitioning between states using
 * the `goTo()` method.
 */
export class RouterStore {
    rootStore: any;
    routes: Route[];
    notFoundState: RouterState;
    @observable.ref routerState: RouterState;

    constructor(rootStore: any, routes: Route[], notFoundState: RouterState) {
        this.rootStore = rootStore;
        this.routes = routes;
        this.notFoundState = notFoundState;

        // Set initial state to an internal initial state
        this.routes.push({ name: INITIAL_ROUTE_NAME, pattern: '' });
        this.routerState = new RouterState(INITIAL_ROUTE_NAME);
    }

    /**
     * Requests a transition to a new state. Note that the actual transition
     * may be different from the requested one based on enter and exit hooks.
     */
    goTo(toState: RouterState): Promise<TransitionResult> {
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
    ): Promise<TransitionResult> {
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
            return Promise.resolve({ fromState: fromState, toState: toState });
        }

        /* istanbul ignore if */
        if (process.env.NODE_ENV === 'development') {
            const fromStateStr = JSON.stringify(fromState);
            const toStateStr = JSON.stringify(toState);
            console.log(
                `RouterStore.transition(${fromStateStr}, ${toStateStr})`
            );
        }

        // Get routes associated with the two states
        const fromRoute = this.getRoute(fromState.routeName);
        const toRoute = this.getRoute(toState.routeName);

        // Call fromState.beforeExit()
        const beforeExit = fromRoute.beforeExit
            ? fromRoute.beforeExit
            : happyTransition;
        return (
            beforeExit(fromState, toState, this)
                // Call toState.beforeEnter()
                .then(result => {
                    const beforeEnter = toRoute.beforeEnter
                        ? toRoute.beforeEnter
                        : happyTransition;
                    return beforeEnter(result.fromState, result.toState, this);
                })

                // Call fromState.onExit()
                .then(result => {
                    const onExit = fromRoute.onExit
                        ? fromRoute.onExit
                        : happyTransition;
                    return onExit(result.fromState, result.toState, this);
                })

                // Call toState.onEnter()
                .then(result => {
                    const onEnter = toRoute.onEnter
                        ? toRoute.onEnter
                        : happyTransition;
                    return onEnter(result.fromState, result.toState, this);
                })

                // Update routerState
                .then(result => {
                    this.setRouterState(result.toState);
                    return result;
                })

                // Handle break from the promise chain
                .catch(result => {
                    if (!result.toState) {
                        throw new Error('toState is undefined');
                    }
                    this.setRouterState(result.toState);
                    return result;
                })
        );
    }

    @action
    private setRouterState(routerState: RouterState) {
        this.routerState = routerState;
    }
}
