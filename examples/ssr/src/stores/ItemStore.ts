import { action, decorate, observable } from 'mobx';
import { Item } from '../models';
import { ContentfulService } from '../services';
import { RootStore } from './RootStore';

export class ItemStore {
    rootStore: RootStore;
    loading: boolean = true;
    items: Array<Item> = [];

    constructor(rootStore: RootStore, items: Array<Item> = []) {
        this.rootStore = rootStore;
        this.handleLoaded(items);
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

decorate(ItemStore, {
    loading: observable,
    items: observable.ref,
    handleStartLoading: action,
    handleLoaded: action,
});
