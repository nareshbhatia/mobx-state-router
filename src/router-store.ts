// TODO: How to get the following imports working without allowSyntheticDefaultImports
// import find from 'lodash/find';
// import isEqual from 'lodash/isEqual';
import * as _ from 'lodash';
import { action, observable, toJS } from 'mobx';

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

export interface Route {
    name: string; // e.g. 'department'
    pattern: string; // e.g. '/departments/:id'
    onBeforeExit?: TransitionFunction;
    onBeforeEnter?: TransitionFunction;
    onExit?: TransitionFunction;
    onEnter?: TransitionFunction;
}

export interface Params {
    [param: string]: string;
}

export interface RouterState {
    routeName: string; // e.g. 'department'
    params: Params; // e.g. { id: 'electronics' }
}

export function newState(routeName: string, params: Params = {}): RouterState {
    return { routeName, params };
}

export function isStateEqual(
    state1: RouterState,
    state2: RouterState
): boolean {
    return (
        state1.routeName === state2.routeName &&
        _.isEqual(state1.params, state2.params)
    );
}

const INITIAL_ROUTE_NAME = '__initial__';

const happyTransition = (fromState: RouterState, toState: RouterState) => {
    return Promise.resolve({ fromState: fromState, toState: toState });
};

/**
 * Holds router state
 */
export class RouterStore {
    rootStore: any;
    routes: Route[];
    notFoundState: RouterState;
    @observable routerState: RouterState;

    constructor(rootStore: any, routes: Route[], notFoundState: RouterState) {
        this.rootStore = rootStore;
        this.routes = routes;
        this.notFoundState = notFoundState;

        // Set initial state to an internal initial state
        this.routes.push({ name: INITIAL_ROUTE_NAME, pattern: '' });
        this.routerState = newState(INITIAL_ROUTE_NAME);
    }

    /**
     * Requests a transition to a new state. Note that the actual transition
     * may be different from the requested toState.
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
     * actual transition may be different from the requested toState.
     */
    private transition(
        fromState: RouterState,
        toState: RouterState
    ): Promise<TransitionResult> {
        // If fromState = toState, do nothing
        // This is important to avoid infinite loops caused by RouterStore.goTo()
        // triggering a change in history, which in turn causes HistoryAdapter
        // to call RouterStore.goTo().
        if (isStateEqual(toJS(fromState), toJS(toState))) {
            return Promise.resolve({ fromState: fromState, toState: toState });
        }

        // console.log(`RouterStore.transition(${fromState}, ${toState})`);

        // Get routes associated with the two states
        const fromRoute = this.getRoute(fromState.routeName);
        const toRoute = this.getRoute(toState.routeName);

        // Call fromState.onBeforeExit()
        const onBeforeExit = fromRoute.onBeforeExit
            ? fromRoute.onBeforeExit
            : happyTransition;
        return (
            onBeforeExit(fromState, toState, this)
                // Call toState.onBeforeEnter()
                .then(result => {
                    const onBeforeEnter = toRoute.onBeforeEnter
                        ? toRoute.onBeforeEnter
                        : happyTransition;
                    return onBeforeEnter(
                        result.fromState,
                        result.toState,
                        this
                    );
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
