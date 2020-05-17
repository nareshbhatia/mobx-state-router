import React, { useContext } from 'react';
import { RootStore } from '../stores';

// ---------- RootStoreContext ----------
export const RootStoreContext = React.createContext<RootStore>(new RootStore());

// ---------- useRootStore ----------
export function useRootStore() {
    return useContext(RootStoreContext);
}
