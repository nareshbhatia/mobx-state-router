import React from 'react';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { observer } from 'mobx-react';
import { useRouterStore } from 'mobx-state-router';
import { Departments } from '../../models';

export const DepartmentNavBar = observer(() => {
    const routerStore = useRouterStore();
    const { id } = routerStore.routerState.params;

    const handleNavItemSelected = (event: any, value: any) => {
        routerStore.goTo('department', {
            params: { id: value },
        });
    };

    return (
        <Tabs value={id} onChange={handleNavItemSelected}>
            {Object.values(Departments).map((dept) => (
                <Tab key={dept.id} value={dept.id} label={dept.name} />
            ))}
        </Tabs>
    );
});
