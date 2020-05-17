import { StringUtils } from '@react-force/utils';
import { Item } from '../models';
import { items } from './items';

const { isBlank } = StringUtils;

// Simulate slow HTTP requests
async function delay(delayTime = 200) {
    await new Promise((resolve) => setTimeout(resolve, delayTime));
}

// Does the item match the specified search key?
const matches = (item: Item, searchKey: string): boolean => {
    const key = searchKey.toLowerCase();
    const name = item.name.toLowerCase();
    const manufacturer = item.manufacturer.toLowerCase();

    return name.includes(key) || manufacturer.includes(key);
};

const getItem = async (id: string): Promise<Item | undefined> => {
    await delay();
    return items.find((item) => item.id === id);
};

const getItems = async (searchKey?: string): Promise<Array<Item>> => {
    await delay();
    return !searchKey || isBlank(searchKey)
        ? items
        : items.filter((item) => matches(item, searchKey));
};

const getFeaturedItems = async () => {
    await delay();
    return items.filter((item) => item.isFeatured);
};

const getDepartmentItems = async (departmentId: string) => {
    await delay();
    return items.filter((item) => item.departmentId === departmentId);
};

export const CatalogService = {
    getItem,
    getItems,
    getFeaturedItems,
    getDepartmentItems,
};
