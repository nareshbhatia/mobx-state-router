import { History, Location } from 'history';
import { reaction } from 'mobx';
import { RouterStore, Route } from '../router-store';
import { generateUrl } from './generate-url';
import { matchUrl } from './match-url';

export class HistoryAdapter {
    routerStore: RouterStore;
    history: History;

    constructor(routerStore: RouterStore, history: History) {
        this.routerStore = routerStore;
        this.history = history;
        this.goToLocation(this.history.location);

        // Listen for history changes
        this.history.listen(location => this.goToLocation(location));
    }

    goToLocation = (location: Location) => {
        const routes = this.routerStore.routes;
        let routeFound = false;
        for (let i = 0; i < routes.length; i++) {
            const route = routes[i];
            const params = matchUrl(location.pathname, route.pattern);
            if (params) {
                this.routerStore.goTo({
                    routeName: route.name,
                    params
                });
                routeFound = true;
                break;
            }
        }

        if (!routeFound) {
            this.routerStore.goToNotFound();
        }
    };

    goBack = () => {
        this.history.goBack();
    };

    observeRouterStateChanges = () => {
        reaction(
            () => this.routerStore.routerState,
            routerState => {
                const { routeName, params } = routerState;
                const route = this.routerStore.getRoute(routeName);
                const url = generateUrl(route.pattern, params);
                if (url !== this.history.location.pathname) {
                    this.history.push(url);
                }
            }
        );
    };
}
