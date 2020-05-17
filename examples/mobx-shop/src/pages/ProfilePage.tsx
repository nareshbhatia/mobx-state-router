import React from 'react';
import Typography from '@material-ui/core/Typography';
import { PageLayout } from '../components';
import { useRootStore } from '../contexts';

export const ProfilePage = () => {
    const rootStore = useRootStore();
    const { authStore } = rootStore;
    const { user } = authStore;
    if (!user) {
        return null;
    }

    return (
        <PageLayout>
            <Typography variant="h5" component="h2">
                {user.email}
            </Typography>
        </PageLayout>
    );
};
