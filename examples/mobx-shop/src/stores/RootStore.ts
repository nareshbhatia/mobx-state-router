import { createRouterState, RouterStore } from 'mobx-state-router';
import { AuthStore } from './AuthStore';
import { CartStore } from './CartStore';
import { ItemStore } from './ItemStore';
import { PrefStore } from './PrefStore';
import { routes } from './routes';

const notFound = createRouterState('notFound');

export class RootStore {
    authStore = new AuthStore(this);
    cartStore = new CartStore(this);
    itemStore = new ItemStore(this);
    prefStore = new PrefStore(this);

    // Pass rootStore as an option to RouterStore
    routerStore = new RouterStore(routes, notFound, {
        rootStore: this,
    });
}
