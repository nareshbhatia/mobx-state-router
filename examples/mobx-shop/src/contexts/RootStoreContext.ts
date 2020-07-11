import React, { useContext } from 'react';
import { RootStore } from '../stores';

// ---------- RootStoreContext ----------
export const RootStoreContext = React.createContext<RootStore | undefined>(
    undefined
);

// ---------- useRootStore ----------
export function useRootStore(): RootStore {
    const rootStore = useContext(RootStoreContext);
    if (rootStore === undefined) {
        /* istanbul ignore next */
        throw new Error('useRootStore must be used within a RootStoreProvider');
    }
    return rootStore;
}
