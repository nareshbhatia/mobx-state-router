import { action, decorate, observable } from 'mobx';
import { createRouterState, RouterState } from 'mobx-state-router';
import { User } from '../models';
import { RootStore } from './RootStore';

const defaultState = createRouterState('home');
const signin = createRouterState('signin');

export class AuthStore {
    rootStore: RootStore;
    user?: User;

    // Where should we redirect after sign in
    signInRedirect: RouterState = defaultState;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    setUser = (user: User) => {
        this.user = user;
        this.rootStore.routerStore.goToState(this.signInRedirect);
    };

    clearUser = () => {
        this.user = undefined;
    };

    setSignInRedirect = (routerState: RouterState) => {
        this.signInRedirect = routerState;
    };

    signOut() {
        this.clearUser();
        this.rootStore.routerStore.goToState(signin);
    }
}

decorate(AuthStore, {
    user: observable.ref,
    signInRedirect: observable.ref,
    setUser: action,
    clearUser: action,
    setSignInRedirect: action,
});
