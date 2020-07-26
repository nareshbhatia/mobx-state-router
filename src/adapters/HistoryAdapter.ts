import Debug from 'debug';
import { History, Location } from 'history';
import { reaction } from 'mobx';
import { RouterState, RouterStore } from '../stores';
import { createMatchingRouterState } from './createMatchingRouterState';
import { routerStateToUrl } from './generateUrl';

const debug = Debug('msr:HistoryAdapter');

/**
 * Responsible for keeping the browser address bar and the `RouterState`
 * in sync. It also provides a `goBack()` method to go back in history.
 */
export class HistoryAdapter {
    routerStore: RouterStore;
    history: History;

    constructor(routerStore: RouterStore, history: History) {
        this.routerStore = routerStore;
        this.history = history;

        // Go to current history location
        this.goToLocation(this.history.location);

        // Listen for history changes
        this.history.listen((location) => this.goToLocation(location));
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
            return this.routerStore.goToState(routerState);
        } else {
            return this.routerStore.goToNotFound();
        }
    };

    goBack = () => {
        this.history.goBack();
    };

    observeRouterStateChanges = () => {
        reaction(
            () => this.routerStore.routerState,
            (routerState: RouterState) => {
                const location = this.history.location;
                const currentUrl = `${location.pathname}${location.search}`;
                const routerStateUrl = routerStateToUrl(
                    this.routerStore,
                    routerState
                );
                if (currentUrl !== routerStateUrl) {
                    if (routerState.options.replaceHistory) {
                        this.history.replace(routerStateUrl);
                    } else {
                        this.history.push(routerStateUrl);
                    }
                    debug(
                        'history.push(%o), history.length=%d',
                        routerStateUrl,
                        this.history.length
                    );
                }
            }
        );
    };
}
