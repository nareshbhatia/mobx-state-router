import React, { useState } from 'react';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import { useMessageSetter } from '@react-force/core';
import { MessageFactory } from '@react-force/models';
import { observer } from 'mobx-react';
import { useRootStore } from '../../contexts';
import { Item } from '../../models';

const useStyles = makeStyles(() => ({
    formControl: {
        minWidth: 60,
    },
}));

interface ItemOrderProps {
    item: Item;
}

export const ItemOrder = observer(({ item }: ItemOrderProps) => {
    const classes = useStyles();
    const setMessage = useMessageSetter();
    const [qty, setQty] = useState(1);
    const rootStore = useRootStore();
    const { cartStore } = rootStore;

    const handleChange = (event: any) => {
        setQty(event.target.value);
    };

    const handleAddToCart = () => {
        cartStore.addOrder(item, qty);
        setMessage(
            MessageFactory.success(
                `Added ${qty} ${item.name}${
                    qty > 1 ? 's' : ''
                } to the shopping cart`
            )
        );
    };

    return (
        <div>
            <FormControl className={classes.formControl}>
                <InputLabel htmlFor="quantity">Qty</InputLabel>
                <Select
                    value={qty}
                    onChange={handleChange}
                    input={<Input name="quantity" id="name" />}
                >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={6}>6</MenuItem>
                    <MenuItem value={7}>7</MenuItem>
                    <MenuItem value={8}>8</MenuItem>
                    <MenuItem value={9}>9</MenuItem>
                </Select>
            </FormControl>

            <IconButton
                color="primary"
                aria-label="Add to shopping cart"
                onClick={handleAddToCart}
            >
                <AddShoppingCartIcon />
            </IconButton>
        </div>
    );
});
