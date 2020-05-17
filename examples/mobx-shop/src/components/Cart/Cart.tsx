import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { CurrencyUtils } from '@react-force/number-utils';
import { observer } from 'mobx-react';
import { useRouterStore } from 'mobx-state-router';
import { useRootStore } from '../../contexts';
import { ItemInfo, ItemPhoto } from '../Item';

const useStyles = makeStyles((theme: Theme) => ({
    item: {
        display: 'flex',
        flexDirection: 'row',
        borderBottom: `1px solid ${theme.palette.divider}`,
        padding: theme.spacing(2),
    },
    col: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        paddingLeft: theme.spacing(1),
        textAlign: 'right',
    },
    price: {
        minWidth: 70,
    },
    qty: {
        minWidth: 16,
    },
    total: {
        minWidth: 75,
    },
    checkout: {
        marginTop: theme.spacing(2),
        marginRight: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    orderTotal: {
        fontSize: 18,
        marginBottom: theme.spacing(2),
    },
}));

export const Cart = observer(() => {
    const classes = useStyles();
    const routerStore = useRouterStore();
    const rootStore = useRootStore();
    const { cartStore } = rootStore;
    const { orderItems, total: orderTotal } = cartStore;

    const handleCheckoutClicked = () => {
        routerStore.goTo('checkout');
    };

    if (orderItems.length === 0) {
        return (
            <Typography variant="h6">Your shopping cart is empty</Typography>
        );
    }

    return (
        <div>
            {orderItems.map((orderItem) => {
                const { item, qty } = orderItem;
                const { id, price } = item;
                const total = price * qty;
                return (
                    <div key={id} className={classes.item}>
                        <ItemPhoto item={item} />
                        <ItemInfo item={item} />
                        <span className={`${classes.col} ${classes.price}`}>
                            {CurrencyUtils.toString(price, 'USD')}
                        </span>
                        <span className={classes.col}>x</span>
                        <span className={`${classes.col} ${classes.qty}`}>
                            {qty}
                        </span>
                        <span className={classes.col}>=</span>
                        <span className={`${classes.col} ${classes.total}`}>
                            {CurrencyUtils.toString(total, 'USD')}
                        </span>
                    </div>
                );
            })}
            <div className={classes.checkout}>
                <div className={classes.orderTotal}>
                    Total: {CurrencyUtils.toString(orderTotal, 'USD')}
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCheckoutClicked}
                >
                    Proceed to checkout
                </Button>
            </div>
        </div>
    );
});
