import { parse, parseUrl, extract } from 'query-string';
import { RouterState, RouterStore, StringMap } from '../router-store';
import { matchUrl } from './match-url';

/**
 * Adapter for static routes
 *
 */
export class StaticAdapter {
    routerStore: RouterStore;
    fullLocation: string;
    location: string;
    search: string;

    constructor(routerStore: RouterStore, location: string) {
        const parsedUrl = parseUrl(location);

        this.routerStore = routerStore;
        this.fullLocation = location;
        this.location = parsedUrl.url;
        this.search = extract(location);
        this.search = '';
    }

    preload(): Promise<any> {
        if (process.env.NODE_ENV === 'development') {
            console.log(
                `StaticAdapter.preload(${JSON.stringify(
                    `${this.fullLocation}`
                )})`
            );
        }

        return Promise.resolve(this.goToLocation(this.location, this.search));
    }

    goToLocation(location: string, search: string): Promise<any> {
        if (process.env.NODE_ENV === 'development') {
            console.log(
                `StaticAdapter.goToLocation(${JSON.stringify(
                    `${this.fullLocation}`
                )})`
            );
        }

        const routes = this.routerStore.routes;
        let route;
        let params: any | StringMap = {};
        for (let i = 0; i < routes.length; i++) {
            route = routes[i];
            params = matchUrl(location, route.pattern);
            if (params) {
                break;
            }
        }

        if (!params || !route) {
            return Promise.resolve(this.routerStore.goToNotFound());
        } else {
            return Promise.resolve(
                this.routerStore.goTo(
                    new RouterState(route.name, params, parse(search))
                )
            );
        }
    }
}
