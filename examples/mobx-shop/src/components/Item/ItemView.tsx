import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import { Item } from '../../models';
import { ItemInfo } from './ItemInfo';
import { ItemPhoto } from './ItemPhoto';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        borderBottom: `1px solid ${theme.palette.divider}`,
        padding: theme.spacing(2),
        cursor: 'pointer',
    },
}));

interface ItemViewProps {
    item: Item;
    onItemClicked: (itemId: string) => void;
}

export const ItemView = observer(({ item, onItemClicked }: ItemViewProps) => {
    const classes = useStyles();

    const handleClick = () => {
        onItemClicked(item.id);
    };

    return (
        <div className={classes.root} onClick={handleClick}>
            <ItemPhoto item={item} />
            <ItemInfo item={item} />
        </div>
    );
});
