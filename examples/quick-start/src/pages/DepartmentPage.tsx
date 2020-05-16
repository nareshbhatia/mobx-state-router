import React from 'react';
import { useRouterStore } from 'mobx-state-router';

export const DepartmentPage = () => {
    const routerStore = useRouterStore();
    const { params } = routerStore.routerState;

    const handleClick = () => {
        routerStore.goTo('home');
    };

    return (
        <div>
            <h1>Welcome to {params.id}</h1>
            <button onClick={handleClick}>Go Home!</button>
        </div>
    );
};
