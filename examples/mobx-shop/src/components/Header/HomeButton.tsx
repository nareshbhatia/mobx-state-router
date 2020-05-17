import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Apps from '@material-ui/icons/Apps';
import { useRouterStore } from 'mobx-state-router';

export const HomeButton = () => {
    const routerStore = useRouterStore();

    const handleClick = () => {
        routerStore.goTo('home');
    };

    return (
        <IconButton
            edge="start"
            color="inherit"
            onClick={handleClick}
            aria-label="Home"
        >
            <Apps />
        </IconButton>
    );
};
