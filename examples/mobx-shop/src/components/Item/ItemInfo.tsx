import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { CurrencyUtils } from '@react-force/number-utils';
import { Item } from '../../models';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(1),
        marginLeft: theme.spacing(4),
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    name: {
        fontSize: 18,
        color: theme.palette.primary.main,
    },
    price: {
        marginTop: theme.spacing(2),
    },
}));

export interface ItemInfoProps {
    item: Item;
}

export const ItemInfo = ({ item }: ItemInfoProps) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className={classes.name}>{item.name}</div>
            <div>by {item.manufacturer}</div>
            <div className={classes.price}>
                {CurrencyUtils.toString(item.price, 'USD')}
            </div>
        </div>
    );
};
