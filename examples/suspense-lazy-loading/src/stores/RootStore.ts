import { createRouterState, RouterStore } from 'mobx-state-router';
import { RepoStore } from './RepoStore';
import { routes } from './routes';

const notFound = createRouterState('notFound');

export class RootStore {
    repoStore = new RepoStore(this);

    // Pass rootStore as an option to RouterStore
    routerStore = new RouterStore(routes, notFound, {
        rootStore: this,
    });
}
