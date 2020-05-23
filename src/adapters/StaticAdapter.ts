import Debug from 'debug';
import { Location } from 'history';
import { RouterState, RouterStore } from '../stores';
import { createMatchingRouterState } from './createMatchingRouterState';

const debug = Debug('msr:StaticAdapter');

/**
 * Responsible for driving `RouterState` programmatically instead of the
 * Browser bar. This is useful in server-side rendering scenarios where
 * the user isn’t actually clicking around, so the location never actually
 * changes. Hence, the name `static`.
 */
export class StaticAdapter {
    routerStore: RouterStore;

    constructor(routerStore: RouterStore) {
        this.routerStore = routerStore;
    }

    goToLocation = (location: Location): Promise<RouterState> => {
        debug('goToLocation: %o', location);

        // Create the matching RouterState
        const routerState = createMatchingRouterState(
            location,
            this.routerStore.routes,
            this.routerStore.options.queryParseOptions
        );
        if (routerState) {
            return this.routerStore.goTo(routerState.routeName, routerState);
        } else {
            return this.routerStore.goToNotFound();
        }
    };
}
