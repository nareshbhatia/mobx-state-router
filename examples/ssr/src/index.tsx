import React from 'react';
import ReactDOM from 'react-dom';
import { RouterContext } from 'mobx-state-router';
import { RootStoreContext } from './contexts';
import { initApp } from './init';
import { App } from './App';
import { RootStoreState } from './stores';
import './index.css';

// Initialize the app from server state
const rootStoreState: RootStoreState = (window as any).__SERVER_STATE__;
delete (window as any).__SERVER_STATE__; // garbage collect
const rootStore = initApp(rootStoreState);
const { routerStore } = rootStore;

ReactDOM.hydrate(
    <React.StrictMode>
        <RootStoreContext.Provider value={rootStore}>
            <RouterContext.Provider value={routerStore}>
                <App />
            </RouterContext.Provider>
        </RootStoreContext.Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
