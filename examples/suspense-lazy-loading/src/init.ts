import { configure } from 'mobx';
import { browserHistory, HistoryAdapter } from 'mobx-state-router';
import { RootStore } from './stores';

function initMobX() {
    // Enable strict mode for MobX.
    // This disallows state changes outside of an action.
    configure({ enforceActions: 'observed' });
}

function initStores() {
    // Create the rootStore
    const rootStore = new RootStore();
    const { routerStore } = rootStore;

    // Observe history changes
    const historyAdapter = new HistoryAdapter(routerStore, browserHistory);
    historyAdapter.observeRouterStateChanges();

    return rootStore;
}

export function initApp() {
    initMobX();
    return initStores();
}
