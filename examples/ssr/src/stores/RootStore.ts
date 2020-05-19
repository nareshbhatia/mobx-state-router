import { createRouterState, RouterState, RouterStore } from 'mobx-state-router';
import { Item, Repo } from '../models';
import { ItemStore } from './ItemStore';
import { RepoStore } from './RepoStore';
import { routes } from './routes';

const home = createRouterState('home');
const notFound = createRouterState('notFound');

export interface RootStoreState {
    routerState: RouterState;
    items: Array<Item>;
    repos: Array<Repo>;
}

export class RootStore {
    itemStore: ItemStore;
    repoStore: RepoStore;
    routerStore: RouterStore;

    constructor(
        state: RootStoreState = {
            routerState: home,
            items: [],
            repos: [],
        }
    ) {
        // Pass rootStore as an option to RouterStore
        this.routerStore = new RouterStore(routes, notFound, {
            initialState: state.routerState,
            rootStore: this,
        });
        this.itemStore = new ItemStore(this, state.items);
        this.repoStore = new RepoStore(this, state.repos);
    }

    serialize() {
        return {
            routerState: this.routerStore.routerState,
            items: this.itemStore.items,
            repos: this.repoStore.repos,
        };
    }
}
