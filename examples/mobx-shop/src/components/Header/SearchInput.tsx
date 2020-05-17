import React, { useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { useRouterStore } from 'mobx-state-router';

const useStyles = makeStyles((theme: Theme) => ({
    wrapper: {
        fontFamily: theme.typography.fontFamily,
        position: 'relative',
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(1),
        borderRadius: 2,
        background: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            background: fade(theme.palette.common.white, 0.25),
        },
        '& $input': {
            transition: theme.transitions.create('width'),
            width: 200,
            '&:focus': {
                width: 250,
            },
        },
    },
    search: {
        width: theme.spacing(9),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        font: 'inherit',
        padding: `${theme.spacing(1)}px ${theme.spacing(1)}px ${theme.spacing(
            1
        )}px ${theme.spacing(9)}px`,
        border: 0,
        display: 'block',
        verticalAlign: 'middle',
        whiteSpace: 'normal',
        background: 'none',
        margin: 0, // Reset for Safari
        color: 'inherit',
        width: '100%',
        '&:focus': {
            outline: 0,
        },
    },
}));

/**
 * Based on Material UI:
 * https://github.com/mui-org/material-ui/blob/v1-beta/docs/src/modules/components/AppSearch.js
 */
export const SearchInput = () => {
    const classes = useStyles();
    const routerStore = useRouterStore();
    const [searchKey, setSearchKey] = useState('');

    const handleChange = (event: any) => {
        setSearchKey(event.target.value);
    };

    const handleSubmit = (event: any) => {
        event.stopPropagation();
        event.preventDefault();
        routerStore.goTo('items', { queryParams: { q: searchKey } });
    };

    return (
        <div className={classes.wrapper}>
            <div className={classes.search}>
                <SearchIcon />
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    className={classes.input}
                    value={searchKey}
                    onChange={handleChange}
                />
            </form>
        </div>
    );
};
