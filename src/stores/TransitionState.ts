import { valueEqual } from '@react-force/utils';
import Debug from 'debug';
import { RouterState } from './RouterState';
import { RouterStore, Route } from './RouterStore';

const debug = Debug('msr:TransitionState');

export class TransitionState {
    private transitions: number = 0;
    private readonly fromRoute: Route;
    private readonly transitionsThreshold: number = 100;

    constructor(
        private routerStore: RouterStore,
        private readonly fromState: RouterState
    ) {
        // Create an object copy so we can modify hooks during transition.
        this.fromRoute = Object.assign(
            {},
            this.routerStore.getRoute(this.fromState.routeName)
        );
    }

    resolve(toState: RouterState): Promise<RouterState> {
        return this.transition(toState);
    }

    private async transition(toState: RouterState): Promise<RouterState> {
        debug('transition from %o to %o)', this.fromState, toState);
        if (this.transitions >= this.transitionsThreshold) {
            throw new Error(
                `Detected loop involving ${this.fromState.routeName} -> ${toState.routeName} transition.`
            );
        }
        // Increment transitions counter. We will use it to detected infinite loops.
        this.transitions++;

        // If fromState = toState, do nothing
        // This is important to avoid infinite loops caused by RouterStore.goTo()
        // triggering a change in history, which in turn causes HistoryAdapter
        // to call RouterStore.goTo().
        if (valueEqual(this.fromState, toState)) {
            debug('states are equal, skipping');
            return toState;
        }

        // Get transition hooks from the target state
        const toRoute = this.routerStore.getRoute(toState.routeName);
        if (!this.fromRoute || !toRoute) {
            this.routerStore.setRouterState(this.routerStore.notFoundState);
            return toState;
        }

        // Call the transition hook chain
        let redirectState;

        // Note: Do not destructure routes so that they can be implemented as
        // classes instead of simple objects.
        // See: https://github.com/nareshbhatia/mobx-state-router/issues/74

        // ----- beforeExit -----
        if (this.fromRoute.beforeExit) {
            redirectState = await this.fromRoute.beforeExit(
                this.fromState,
                toState,
                this.routerStore
            );
            this.fromRoute.beforeExit = undefined;
            if (redirectState && !valueEqual(redirectState, toState)) {
                return this.transition(redirectState);
            }
        }

        // ----- beforeEnter -----
        if (toRoute.beforeEnter) {
            redirectState = await toRoute.beforeEnter(
                this.fromState,
                toState,
                this.routerStore
            );
            if (redirectState && !valueEqual(redirectState, toState)) {
                return this.transition(redirectState);
            }
        }

        // ----- onExit -----
        if (this.fromRoute.onExit) {
            redirectState = await this.fromRoute.onExit(
                this.fromState,
                toState,
                this.routerStore
            );
            this.fromRoute.onExit = undefined;
            if (redirectState && !valueEqual(redirectState, toState)) {
                return this.transition(redirectState);
            }
        }

        // ----- onEnter -----
        if (toRoute.onEnter) {
            redirectState = await toRoute.onEnter(
                this.fromState,
                toState,
                this.routerStore
            );
            if (redirectState && !valueEqual(redirectState, toState)) {
                return this.transition(redirectState);
            }
        }

        // No redirection happened in the redirect chain.
        // So transition to toState.
        this.routerStore.setRouterState(toState);
        return toState;
    }
}
