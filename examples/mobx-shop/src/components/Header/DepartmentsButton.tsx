import React from 'react';
import Button from '@material-ui/core/Button';
import { useRouterStore } from 'mobx-state-router';
import { Departments } from '../../models';

export const DepartmentsButton = () => {
    const routerStore = useRouterStore();

    const handleClick = () => {
        routerStore.goTo('department', {
            params: { id: Object.keys(Departments)[0] },
        });
    };

    return (
        <Button color="inherit" onClick={handleClick} aria-label="Departments">
            Departments
        </Button>
    );
};
