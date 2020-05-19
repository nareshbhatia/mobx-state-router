import { RouterState, RouterStore } from 'mobx-state-router';
import { RootStore } from './RootStore';

// Routes are matched from top to bottom. Make sure they are sequenced
// in the order of priority. It is generally best to sort them by pattern,
// prioritizing specific patterns over generic patterns (patterns with
// one or more parameters). For example:
//     /items
//     /items/:id
export const routes = [
    { name: 'home', pattern: '/' },
    {
        name: 'contentful',
        pattern: '/contentful',
        onEnter: async (
            fromState: RouterState,
            toState: RouterState,
            routerStore: RouterStore
        ) => {
            const { rootStore } = routerStore.options;
            const { itemStore } = rootStore as RootStore;
            return itemStore.loadFeaturedItems();
        },
    },
    {
        name: 'github',
        pattern: '/github',
        onEnter: async (
            fromState: RouterState,
            toState: RouterState,
            routerStore: RouterStore
        ) => {
            const { rootStore } = routerStore.options;
            const { repoStore } = rootStore as RootStore;
            return repoStore.loadTopRepos();
        },
    },
    { name: 'notFound', pattern: '/not-found' },
];
