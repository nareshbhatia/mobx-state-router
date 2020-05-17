import React from 'react';
import { HorizontalContainer } from '@react-force/core';
import { observer } from 'mobx-react';
import { useRootStore } from '../contexts';
import {
    ItemInfo,
    ItemOrder,
    ItemPhoto,
    NavButtonEnum,
    PageLayout,
} from '../components';

export const ItemPage = observer(() => {
    const rootStore = useRootStore();
    const { itemStore } = rootStore;
    const { selectedItem } = itemStore;

    if (!selectedItem) {
        return null;
    }

    return (
        <PageLayout navButtonEnum={NavButtonEnum.Back}>
            <HorizontalContainer>
                <ItemPhoto item={selectedItem} />
                <ItemInfo item={selectedItem} />
                <ItemOrder item={selectedItem} />
            </HorizontalContainer>
        </PageLayout>
    );
});
