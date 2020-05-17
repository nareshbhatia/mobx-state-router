import React, { ReactNode } from 'react';
import { ScrollingContainer, ViewVerticalContainer } from '@react-force/core';
import { Header, NavButtonEnum } from '../Header';

export interface PageLayoutProps {
    navButtonEnum?: NavButtonEnum;
    children: ReactNode;
}

export const PageLayout = ({
    children,
    navButtonEnum = NavButtonEnum.Home,
}: PageLayoutProps) => {
    return (
        <ViewVerticalContainer minHeight={0}>
            <Header navButtonEnum={navButtonEnum} />
            <ScrollingContainer p={2}>{children}</ScrollingContainer>
        </ViewVerticalContainer>
    );
};
