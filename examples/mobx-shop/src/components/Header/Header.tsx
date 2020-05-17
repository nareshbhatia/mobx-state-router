import React from 'react';
import { Header as BaseHeader, HeaderTitle } from '@react-force/core';
import { observer } from 'mobx-react';
import { BackButton } from './BackButton';
import { CartButton } from './CartButton';
import { DepartmentsButton } from './DepartmentsButton';
import { HeaderMenu } from './HeaderMenu';
import { HomeButton } from './HomeButton';
import { SearchInput } from './SearchInput';

export enum NavButtonEnum {
    None,
    Home,
    Back,
}

export interface HeaderProps {
    navButtonEnum?: NavButtonEnum;
    title?: string;
}

export const Header = observer(
    ({
        navButtonEnum = NavButtonEnum.Home,
        title = 'MobX Shop',
    }: HeaderProps) => {
        return (
            <BaseHeader>
                {navButtonEnum === NavButtonEnum.Home && <HomeButton />}
                {navButtonEnum === NavButtonEnum.Back && <BackButton />}
                <HeaderTitle>{title}</HeaderTitle>
                <SearchInput />
                <DepartmentsButton />
                <CartButton />
                <HeaderMenu />
            </BaseHeader>
        );
    }
);
