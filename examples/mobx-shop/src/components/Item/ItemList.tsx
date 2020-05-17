import React from 'react';
import { observer } from 'mobx-react';
import { useRouterStore } from 'mobx-state-router';
import { useRootStore } from '../../contexts';
import { ItemView } from './ItemView';

export const ItemList = observer(() => {
    const routerStore = useRouterStore();
    const rootStore = useRootStore();
    const { itemStore } = rootStore;

    const handleItemClicked = (itemId: string) => {
        routerStore.goTo('item', { params: { id: itemId } });
    };

    return (
        <div>
            {itemStore.items.map((item) => (
                <ItemView
                    key={item.id}
                    item={item}
                    onItemClicked={handleItemClicked}
                />
            ))}
        </div>
    );
});
