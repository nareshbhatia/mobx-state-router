import React, { ReactNode } from 'react';
import './TitleLink.css';

interface TitleLinkProps {
    children: ReactNode;
    href: string;
}

export const TitleLink = ({ children, ...others }: TitleLinkProps) => (
    <h3 className="title-link">
        <a className="title-link__link" {...others}>
            {children}
        </a>
    </h3>
);
