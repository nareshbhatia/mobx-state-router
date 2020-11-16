import { action, makeObservable, observable } from 'mobx';
import { Item } from '../models';
import { ContentfulService } from '../services';
import { RootStore } from './RootStore';

export class ItemStore {
    rootStore: RootStore;
    loading: boolean = true;
    items: Array<Item> = [];

    constructor(rootStore: RootStore, items: Array<Item> = []) {
        makeObservable(this, {
            loading: observable,
            items: observable.ref,
            handleStartLoading: action,
            handleLoaded: action,
        });
        this.rootStore = rootStore;
        this.handleLoaded(items);
        makeObservable(this, {
            loading: observable,
            items: observable.ref,
            handleStartLoading: action,
            handleLoaded: action,
        });
    }

    handleStartLoading() {
        this.loading = true;
    }

    handleLoaded(items: Array<Item>) {
        this.loading = false;
        this.items = items;
    }

    async loadFeaturedItems() {
        this.handleStartLoading();
        const items = await ContentfulService.fetchFeaturedItems();
        this.handleLoaded(items);
    }
}
