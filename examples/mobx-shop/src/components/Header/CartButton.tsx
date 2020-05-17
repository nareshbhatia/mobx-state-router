import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import { useRouterStore } from 'mobx-state-router';

export const CartButton = () => {
    const routerStore = useRouterStore();

    const handleClick = () => {
        routerStore.goTo('cart');
    };

    return (
        <IconButton
            color="inherit"
            onClick={handleClick}
            aria-label="Go to shopping cart"
        >
            <ShoppingCart />
        </IconButton>
    );
};
