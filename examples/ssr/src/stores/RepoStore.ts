import { action, makeObservable, observable } from 'mobx';
import { Repo } from '../models';
import { GitHubService } from '../services';
import { RootStore } from './RootStore';

export class RepoStore {
    rootStore: RootStore;
    loading: boolean = true;
    repos: Array<Repo> = [];

    constructor(rootStore: RootStore, repos: Array<Repo> = []) {
        makeObservable(this, {
            loading: observable,
            repos: observable.ref,
            handleStartLoading: action,
            handleLoaded: action,
        });
        this.rootStore = rootStore;
        this.handleLoaded(repos);
        makeObservable(this, {
            loading: observable,
            repos: observable.ref,
            handleStartLoading: action,
            handleLoaded: action,
        });
    }

    handleStartLoading() {
        this.loading = true;
    }

    handleLoaded(repos: Array<Repo>) {
        this.loading = false;
        this.repos = repos;
    }

    async loadTopRepos() {
        this.handleStartLoading();
        const repos = await GitHubService.fetchTopRepos();
        this.handleLoaded(repos);
    }
}
