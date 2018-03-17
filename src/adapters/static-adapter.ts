import { parse, parseUrl, extract } from 'query-string';
import { RouterState, RouterStore, StringMap } from '../router-store';
import { matchUrl } from './match-url';

/**
 * Responsible for keeping the `RouterState` without sync with the Browser bar.
 * It also provides a `preloadReady()` method await loading current route.
 */
export class StaticAdapter {
    routerStore: RouterStore;
    fullLocation: string;
    location: string;
    search: string;
    readyLoad: Promise<any>;

    constructor(routerStore: RouterStore, location: string) {
        const parsedUrl = parseUrl(location);

        this.routerStore = routerStore;
        this.fullLocation = location;
        this.location = parsedUrl.url;
        this.search = extract(location);

        this.readyLoad = this.goToLocation(this.location, this.search);
    }

    preloadReady(): Promise<any> {
        if (process.env.NODE_ENV === 'development') {
            console.log(`StaticAdapter.preloadReady()`);
        }

        return Promise.resolve(this.readyLoad);
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
