import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { browserHistory } from 'mobx-state-router';

export const BackButton = () => {
    return (
        <IconButton
            edge="start"
            color="inherit"
            onClick={browserHistory.goBack}
            aria-label="Back"
        >
            <ArrowBack />
        </IconButton>
    );
};
