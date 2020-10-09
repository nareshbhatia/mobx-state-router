import React from 'react';
import { observer } from 'mobx-react-lite';
import { CurrencyUtils } from '@react-force/number-utils';
import { useRootStore } from '../contexts';
import { Item } from '../models';
import './ContentfulPage.css';

const ItemView = ({ item }: { item: Item }) => (
    <div className="item">
        <div className="item__lhs">
            <img
                className="item__photo"
                src={`https:${item.photo.url}?w=120`}
                alt={item.photo.title}
            />
        </div>

        <div className="item__rhs">
            <div className="item__name">{item.name}</div>
            <div>by {item.manufacturer}</div>
            <div className="item__price">
                {CurrencyUtils.toString(item.price, 'USD')}
            </div>
        </div>
    </div>
);

export const ContentfulPage = observer(() => {
    const rootStore = useRootStore();
    return (
        <div className="content">
            <h1 className="title">Featured Items</h1>
            <ul className="item-list">
                {rootStore.itemStore.items.map((item) => (
                    <li key={item.id}>
                        <ItemView item={item} />
                    </li>
                ))}
            </ul>
        </div>
    );
});
