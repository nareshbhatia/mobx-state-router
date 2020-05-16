import React from 'react';
import { StringMap, valueEqual } from '@react-force/utils';
import { observer } from 'mobx-react';
import { routerStateToUrl } from '../adapters';
import { useRouterStore } from '../contexts';
import { createRouterState } from '../stores';

function isLeftClickEvent(event: React.MouseEvent<HTMLElement>) {
    return event.button === 0;
}

function isModifiedEvent(event: React.MouseEvent<HTMLElement>) {
    return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
}

export interface RouterLinkProps
    extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    routeName: string;
    params?: StringMap;
    queryParams?: { [key: string]: any };
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
 * The target state is specified by the `routeName`, `params` and `queryParams`
 * properties.
 *
 * RouterLink accepts `className` and `activeClassName` as optional
 * properties. `className` is always applied to the anchor tag.
 * `activeClassName` is applied in addition if the current `routerState`
 * matches the state specified by the `RouterLink`. This feature is
 * useful for highlighting the active link in a navbar.
 *
 * Note that you can pass other anchor tag attributes (such as onClick
 * and onBlur) to this component. They will be passed through to the
 * child anchor tag except for `href`, which is fully computed by this
 * component.
 */
export const RouterLink = observer(
    ({
        routeName,
        params,
        queryParams,
        className,
        activeClassName,
        children,
        href, // remove from `...others`
        onClick, // remove from `...others`
        ...others
    }: RouterLinkProps) => {
        const routerStore = useRouterStore();
        const { routerState } = routerStore;

        // Make sure we don't send undefined params or query params
        const toState = createRouterState(routeName, {
            params: params ? params : {},
            queryParams: queryParams ? queryParams : {},
        });

        const isActive = valueEqual(routerState, toState);
        const joinedClassName =
            (className ? className : '') +
            (isActive && activeClassName ? ' ' + activeClassName : '');

        const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
            // Ignore if link is clicked using a modifier key or not left-clicked
            if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
                return undefined;
            }

            // Prevent default action which reloads the app
            event.preventDefault();

            // Call onClick hook if present
            if (onClick) onClick(event);

            // Change the router state to trigger a refresh
            return routerStore.goToState(toState);
        };

        return (
            <a
                className={joinedClassName}
                href={routerStateToUrl(routerStore, toState)}
                onClick={handleClick}
                {...others}
            >
                {children}
            </a>
        );
    }
);
