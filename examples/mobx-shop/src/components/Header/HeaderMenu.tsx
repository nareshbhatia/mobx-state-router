import React, { Fragment, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles, Theme } from '@material-ui/core/styles';
import DarkIcon from '@material-ui/icons/Brightness2';
import LightIcon from '@material-ui/icons/Brightness2Outlined';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { observer } from 'mobx-react';
import { useRouterStore } from 'mobx-state-router';
import { useRootStore } from '../../contexts';

const useStyles = makeStyles((theme: Theme) => ({
    themeLabel: {
        flex: 1,
    },
    themeIcon: {
        marginLeft: theme.spacing(2),
    },
}));

export const HeaderMenu = observer(() => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(anchorEl);
    const routerStore = useRouterStore();
    const rootStore = useRootStore();
    const { authStore, prefStore } = rootStore;
    const { user } = authStore;
    const { paletteType } = prefStore;

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSignIn = () => {
        routerStore.goTo('signin');
    };

    const handleSignOut = () => {
        authStore.signOut();
    };

    const handleProfileClicked = () => {
        routerStore.goTo('profile');
    };

    const handleToggleTheme = () => {
        handleMenuClose();
        prefStore.toggleTheme();
    };

    return (
        <Fragment>
            <IconButton
                edge="end"
                color="inherit"
                onClick={handleMenuOpen}
                aria-owns={isMenuOpen ? 'menu' : undefined}
                aria-haspopup="true"
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="menu"
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isMenuOpen}
                onClose={handleMenuClose}
            >
                {user ? (
                    <MenuItem onClick={handleProfileClicked}>
                        {user.email}
                    </MenuItem>
                ) : (
                    <MenuItem onClick={handleSignIn}>Sign In</MenuItem>
                )}

                {user ? (
                    <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                ) : null}

                <MenuItem onClick={handleToggleTheme}>
                    <span className={classes.themeLabel}>Toggle Theme</span>
                    {paletteType === 'light' ? (
                        <LightIcon className={classes.themeIcon} />
                    ) : (
                        <DarkIcon className={classes.themeIcon} />
                    )}
                </MenuItem>
            </Menu>
        </Fragment>
    );
});
