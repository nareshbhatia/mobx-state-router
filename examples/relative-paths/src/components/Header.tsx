import React from 'react';
import { RouterLink } from 'mobx-state-router';
import './Header.css';

export const Header = () => (
    <header>
        <ul className="navbar">
            <li>
                <RouterLink routeName="home" activeClassName="link--active">
                    Home
                </RouterLink>
            </li>
            <li>
                <RouterLink routeName="about" activeClassName="link--active">
                    About
                </RouterLink>
            </li>
        </ul>
    </header>
);
