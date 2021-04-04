import { createBrowserHistory } from 'history';
import {
    createRouterState,
    HistoryAdapter,
    RouterStore,
} from 'mobx-state-router';

const browserHistory = createBrowserHistory();

const notFound = createRouterState('notFound');

const routes = [
    { name: 'home', pattern: '/' },
    { name: 'about', pattern: '/about' },
    { name: 'notFound', pattern: '/not-found' },
];

export function initRouter() {
    const routerStore = new RouterStore(routes, notFound);

    // Observe history changes
    const historyAdapter = new HistoryAdapter(routerStore, browserHistory);
    historyAdapter.observeRouterStateChanges();

    return routerStore;
}
