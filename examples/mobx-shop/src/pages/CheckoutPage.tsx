import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Checkout, PageLayout } from '../components';

export const CheckoutPage = () => {
    return (
        <PageLayout>
            <Typography variant="h5" component="h2">
                <Checkout />
            </Typography>
        </PageLayout>
    );
};
