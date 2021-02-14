import React from 'react';
import ReactDOM from 'react-dom';
import { RouterContext } from 'mobx-state-router';
import { RootStoreContext } from './contexts';
import { initApp } from './init';
import { App } from './App';
import './index.css';

// Initialize the app
const rootStore = initApp();
const { routerStore } = rootStore;

ReactDOM.render(
    <React.StrictMode>
        <RootStoreContext.Provider value={rootStore}>
            <RouterContext.Provider value={routerStore}>
                <App />
            </RouterContext.Provider>
        </RootStoreContext.Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
