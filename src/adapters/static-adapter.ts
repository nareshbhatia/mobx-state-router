import { parse, parseUrl, extract } from 'query-string';
import { RouterState, RouterStore } from '../router-store';
import { matchUrl } from './match-url';

/**
 * Adapter for static routes
 *
 */
export class StaticAdapter {
    routerStore: RouterStore;
    location: string;
    search: string;

    constructor(routerStore: RouterStore, location: string) {
        const parsedUrl = parseUrl(location);

        this.routerStore = routerStore;
        this.location = parsedUrl.url;
        this.search = extract(location);
        this.search = '';
    }

    preload(): Promise<any> {
        if (process.env.NODE_ENV === 'development') {
            console.log(
                `StaticAdapter.preload(${JSON.stringify(
                    `${this.location}?${this.search}`
                )})`
            );
        }

        return Promise.resolve(this.goToLocation(this.location, this.search));
    }

    goToLocation(location: string, search: string): Promise<any> {
        if (process.env.NODE_ENV === 'development') {
            console.log(
                `StaticAdapter.goToLocation(${JSON.stringify(
                    `${location}?${search}`
                )})`
            );
        }

        const routes = this.routerStore.routes;
        let routeFound = false;
        for (let i = 0; i < routes.length; i++) {
            const route = routes[i];
            const params = matchUrl(location, route.pattern);
            if (params) {
                routeFound = true;
                return Promise.resolve(
                    this.routerStore.goTo(
                        new RouterState(route.name, params, parse(search))
                    )
                );
            }
        }

        if (!routeFound) {
            return Promise.resolve(this.routerStore.goToNotFound());
        }

        return Promise.resolve();
    }
}
