import { ContentfulClientApi, createClient } from 'contentful';
import { Item } from '../models';

const host = 'cdn.contentful.com';
const CONTENT_TYPE_ITEM = 'item';

let client: ContentfulClientApi;
let authorized = false;

const init = (spaceId: string, accessToken: string) => {
    client = createClient({
        space: spaceId,
        accessToken,
        host,
    });
};

const getClient = async (): Promise<ContentfulClientApi> => {
    if (authorized) {
        return client;
    } else {
        await client.getSpace();
        authorized = true;
        return client;
    }
};

const fetchFeaturedItems = async (): Promise<Array<Item>> => {
    const client = await getClient();
    const response = await client.getEntries({
        content_type: CONTENT_TYPE_ITEM,
        'fields.isFeatured': true,
        order: 'fields.manufacturer.sys.id',
    });
    const { includes, items } = response;
    const { Asset: assets, Entry: entries } = includes;
    return items.map((item) => {
        const { fields, sys } = item;
        const { id } = sys;
        const {
            department,
            isFeatured,
            manufacturer,
            name,
            photo,
            price,
        } = fields as any;

        const photoId = photo.sys.id;
        const photoAsset = assets.find(
            (asset: any) => asset.sys.id === photoId
        );

        const departmentId = department.sys.id;
        const departmentEntry = entries.find(
            (entry: any) => entry.sys.id === departmentId
        );

        const manufacturerId = manufacturer.sys.id;
        const manufacturerEntry = entries.find(
            (entry: any) => entry.sys.id === manufacturerId
        );

        return {
            id,
            name,
            department: departmentEntry.fields.name,
            manufacturer: manufacturerEntry.fields.name,
            price,
            photo: {
                url: photoAsset.fields.file.url,
                title: photoAsset.fields.title,
            },
            isFeatured,
        };
    });
};

export const ContentfulService = {
    init,
    getClient,
    fetchFeaturedItems,
};
