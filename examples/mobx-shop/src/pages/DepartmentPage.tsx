import React from 'react';
import { DepartmentNavBar, ItemList, PageLayout } from '../components';

export const DepartmentPage = () => {
    return (
        <PageLayout>
            <DepartmentNavBar />
            <ItemList />
        </PageLayout>
    );
};
