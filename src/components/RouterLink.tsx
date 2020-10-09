import { StringMap } from '@react-force/utils';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { routerStateToUrl } from '../adapters';
import { useRouterStore } from '../contexts';
import { createRouterState, RouterState } from '../stores';

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
    isActive?: (currentState: RouterState, toState: RouterState) => boolean;
}

// Default check for isActive is to match the routeNames
const defaultIsActive = (currentState: RouterState, toState: RouterState) =>
    currentState.routeName === toState.routeName;

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
 * `RouterLink` accepts `className` and `activeClassName` as optional
 * properties to control the look of the link in normal and active states.
 * This feature is useful for highlighting the active link in a navbar.
 * The default test for checking if a link is active is very simple - the
 * routeName of the current RouterState should match the target routeName
 * of the link. For more control over this test, you can supply your own
 * custom `isActive` function.
 *
 * You can pass other anchor tag attributes (such as onClick and onBlur) to
 * this component. They will be passed through to the child anchor tag except
 * for `href`, which is fully computed by this component.
 */
export const RouterLink: React.FC<RouterLinkProps> = observer(
    ({
        routeName,
        params = {},
        queryParams = {},
        className,
        activeClassName,
        isActive = defaultIsActive,
        children,
        href, // remove from `...others`
        onClick, // remove from `...others`
        ...others
    }) => {
        const routerStore = useRouterStore();
        const { routerState } = routerStore;

        const toState = createRouterState(routeName, { params, queryParams });

        const joinedClassName =
            (className ? className : '') +
            (isActive(routerState, toState) && activeClassName
                ? ' ' + activeClassName
                : '');

        const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
            // Ignore if link is clicked using a modifier key.
            // Note: The click event is only fired for the primary pointer button,
            // i.e. the left mouse button. So no need to check for right-click.
            // https://w3c.github.io/uievents/#event-type-click
            // https://github.com/testing-library/testing-library-docs/issues/469
            if (isModifiedEvent(event)) {
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
