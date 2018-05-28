import * as React from 'react';
import { inject } from 'mobx-react';
import { StringMap } from '../router-store';
import { Link } from './link';

export interface RouterLinkProps {
    rootStore?: any;
    routeName: string;
    params?: StringMap;
    queryParams?: Object;
    className?: string;
    activeClassName?: string;
}

/**
 * Creates an anchor tag that links to a router state. Redirects to the target
 * state without reloading the entire app, thus avoiding potential flickers.
 *
 * Example:
 *     <RouterLink routeName="home">
 *         Home
 *     </RouterLink>
 *
 * Note that `rootStore` is injected directly into the RouterLink, there
 * is no need to pass it as prop.
 *
 * The target state is specified by the `routeName`, `params` and `queryParams`
 * properties.
 *
 * RouterLink accepts `className` and `activeClassName` as optional
 * properties. `className` is always applied to the anchor tag.
 * `activeClassName` is applied in addition if the current `routerState`
 * matches the state specified by the `RouterLink`. This feature is
 * useful for highlighting the active link in a navbar.
 */

export const RouterLink = inject('rootStore')((props: RouterLinkProps) => {
    const {
        rootStore: { routerStore },
        routeName,
        ...restProps
    } = props;

    return (
        <Link routerStore={routerStore} toState={routeName} {...restProps} />
    );
});
