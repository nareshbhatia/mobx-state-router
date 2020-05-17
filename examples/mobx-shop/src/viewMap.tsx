import React from 'react';
import { NotFound } from '@react-force/core';
import {
    CartPage,
    CheckoutPage,
    DepartmentPage,
    HomePage,
    ItemListPage,
    ItemPage,
    ProfilePage,
    SignInPage,
} from './pages';

export const viewMap = {
    cart: <CartPage />,
    checkout: <CheckoutPage />,
    department: <DepartmentPage />,
    home: <HomePage />,
    item: <ItemPage />,
    items: <ItemListPage />,
    notFound: <NotFound />,
    profile: <ProfilePage />,
    signin: <SignInPage />,
};
