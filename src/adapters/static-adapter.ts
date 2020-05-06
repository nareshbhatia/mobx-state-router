import { Location } from 'history';
import { RouterState, RouterStore } from '../router-store';
import { findMatchingRoute } from './find-matching-route';

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
        // /* istanbul ignore if */
        // if (process.env.NODE_ENV === 'development') {
        //     console.log(
        //         `StaticAdapter.goToLocation(${JSON.stringify(location)})`
        //     );
        // }

        // Find the matching route
        const matchingRoute = findMatchingRoute(
            location,
            this.routerStore.routes
        );
        if (matchingRoute) {
            return this.routerStore.goTo(RouterState.create(matchingRoute));
        } else {
            return this.routerStore.goToNotFound();
        }
    };
}
