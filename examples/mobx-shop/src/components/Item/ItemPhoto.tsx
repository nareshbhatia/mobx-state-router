import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Item } from '../../models';

const useStyles = makeStyles(() => ({
    root: {
        width: 120,
    },
    photo: {
        display: 'block',
        width: '100%',
        height: 'auto',
    },
}));

interface ItemPhotoProps {
    item: Item;
}

export const ItemPhoto = ({ item }: ItemPhotoProps) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <img className={classes.photo} src={item.photo} alt={item.name} />
        </div>
    );
};
