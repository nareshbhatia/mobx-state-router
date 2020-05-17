import { createMuiTheme, PaletteType } from '@material-ui/core';
import red from '@material-ui/core/colors/red';
import pink from '@material-ui/core/colors/pink';

import { Storage } from '@react-force/web-utils';
import { action, computed, decorate, observable } from 'mobx';
import { LsKeys } from './LsKeys';
import { RootStore } from './RootStore';

export class PrefStore {
    rootStore: RootStore;
    paletteType: PaletteType = 'light';

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    // ----- Load from storage -----
    loadFromStorage() {
        this.paletteType = Storage.get(LsKeys.paletteType, 'light');
    }

    // ----- Actions -----
    toggleTheme = () => {
        this.paletteType = this.paletteType === 'light' ? 'dark' : 'light';
        Storage.set(LsKeys.paletteType, this.paletteType);
    };

    // ----- Computed -----
    get theme() {
        const palette = {
            primary: {
                main: '#556CD6',
            },
            secondary: {
                main: pink.A400,
            },
            error: {
                main: red.A400,
            },
            type: this.paletteType,
            // Initialize background to white (default is #fafafa)
            // This allows pictures with white background to blend in.
            background: {
                default: this.paletteType === 'light' ? '#ffffff' : '#303030',
            },
        };

        return createMuiTheme({ palette });
    }
}

decorate(PrefStore, {
    paletteType: observable,
    theme: computed,
    loadFromStorage: action,
    toggleTheme: action,
});
