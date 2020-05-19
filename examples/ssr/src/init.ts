import { configure } from 'mobx';
import { browserHistory, HistoryAdapter } from 'mobx-state-router';
import { ContentfulService } from './services';
import { RootStore, RootStoreState } from './stores';

function initMobX() {
    // Enable strict mode for MobX.
    // This disallows state changes outside of an action.
    configure({ enforceActions: 'observed' });
}

function initServices() {
    if (
        process.env.REACT_APP_CONTENTFUL_SPACE_ID &&
        process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN
    ) {
        ContentfulService.init(
            process.env.REACT_APP_CONTENTFUL_SPACE_ID,
            process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN
        );
    }
}

function initStores(rootStoreState: RootStoreState) {
    // Create the rootStore
    const rootStore = new RootStore(rootStoreState);
    const { routerStore } = rootStore;

    // Observe history changes
    const historyAdapter = new HistoryAdapter(routerStore, browserHistory);
    historyAdapter.observeRouterStateChanges();

    return rootStore;
}

export function initApp(rootStoreState: RootStoreState) {
    initMobX();
    initServices();
    return initStores(rootStoreState);
}
