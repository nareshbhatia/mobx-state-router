import React from 'react';
import Typography from '@material-ui/core/Typography';
import { ItemList, PageLayout } from '../components';

export const HomePage = () => {
    return (
        <PageLayout>
            <Typography variant="h5" component="h2">
                Featured Items
            </Typography>
            <ItemList />
        </PageLayout>
    );
};
