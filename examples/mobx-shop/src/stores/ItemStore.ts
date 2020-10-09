import { action, makeObservable, IObservableArray, observable } from 'mobx';
import { RootStore } from './RootStore';
import { Item } from '../models';
import { CatalogService } from '../services';

export class ItemStore {
    rootStore: RootStore;
    items: IObservableArray<Item> = observable.array([]);
    selectedItem?: Item;

    constructor(rootStore: RootStore) {
        makeObservable(this, {
            selectedItem: observable.ref,
            setItems: action,
            clearItems: action,
            setSelectedItem: action,
        });
        this.rootStore = rootStore;
    }

    setItems(items: Array<Item>) {
        this.items.replace(items);
    }

    clearItems() {
        this.items.clear();
    }

    setSelectedItem(item: Item | undefined) {
        this.selectedItem = item;
    }

    selectItem = async (itemId: string) => {
        const item = await CatalogService.getItem(itemId);
        this.setSelectedItem(item);
    };

    loadMatchingItems = async (searchKey: string) => {
        const items = await CatalogService.getItems(searchKey);
        this.setItems(items);
    };

    loadFeaturedItems = async () => {
        const items = await CatalogService.getFeaturedItems();
        this.setItems(items);
    };

    loadDepartmentItems = async (department: string) => {
        const items = await CatalogService.getDepartmentItems(department);
        this.setItems(items);
    };
}
