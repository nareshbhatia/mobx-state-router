import React from 'react';
import { useRouterStore } from 'mobx-state-router';

export const HomePage = () => {
    const routerStore = useRouterStore();

    const handleClick = () => {
        routerStore.goTo('department', {
            params: { id: 'electronics' },
        });
    };

    return (
        <div>
            <h1>Home</h1>
            <button onClick={handleClick}>Go to Electronics</button>
        </div>
    );
};
