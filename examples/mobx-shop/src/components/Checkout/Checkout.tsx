import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useMessageSetter } from '@react-force/core';
import { MessageFactory } from '@react-force/models';
import { CurrencyUtils } from '@react-force/number-utils';
import { observer } from 'mobx-react';
import { useRootStore } from '../../contexts';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        marginTop: theme.spacing(2),
    },
    orderTotal: {
        fontSize: 18,
        marginBottom: theme.spacing(2),
    },
}));

export const Checkout = observer(() => {
    const classes = useStyles();
    const setMessage = useMessageSetter();
    const rootStore = useRootStore();
    const { cartStore } = rootStore;
    const { total: orderTotal } = cartStore;

    const handlePlaceOrder = () => {
        cartStore.clearCart();
        setMessage(
            MessageFactory.success(
                'Order placed. We’ll send a confirmation when your items ship.'
            )
        );
    };

    return (
        <div className={classes.root}>
            <div className={classes.orderTotal}>
                Order Total: {CurrencyUtils.toString(orderTotal, 'USD')}
            </div>

            <Button
                variant="contained"
                color="primary"
                onClick={handlePlaceOrder}
            >
                Place Order
            </Button>
        </div>
    );
});
