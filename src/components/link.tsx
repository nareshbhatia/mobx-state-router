import * as React from 'react';
import { withRouter, WithRouterProps } from './hocs';

export interface BaseLinkProps {
    href?: string;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    active?: boolean;
    className?: string;
    activeClassName?: string;
}

const BaseLink = (props: BaseLinkProps) => {
    const { active, className, activeClassName, ...restProps } = props;

    const classname =
        (className || '') +
        (active && activeClassName ? ' ' + activeClassName : '');

    return <a {...restProps} className={classname} />;
};

/**
 * Creates an anchor tag that links to a router state. Redirects to the target
 * state without reloading the entire app, thus avoiding potential flickers.
 *
 * Example:
 *
 *     const state = new RouterState(
 *         'department',
 *         { id: 'electronics' },
 *         { q: 'apple' }
 *     );
 *
 *     ...
 *
 *     <Link routerStore={routerStore} toState={state}>
 *         Apple
 *     </Link>
 *
 *     <Link
 *         routerStore={routerStore}
 *         toState='department'
 *         params={{ id: 'electronics' }}
 *         queryParams={{ q: 'samsung' }}
 *     />
 *         Samsung
 *     </Link>
 *
 * Link accepts `className` and `activeClassName` as optional
 * properties. `className` is always applied to the anchor tag.
 * `activeClassName` is applied in addition if the current `routerState`
 * matches the state specified by the `Link`. This feature is
 * useful for highlighting the active link in a navbar.
 *
 * @see RouterLink for simpler way to create anchor tags.
 */

// FIXME: Need documentation
export const Link = withRouter(BaseLink, 'active');
export { WithRouterProps } from './hocs';
