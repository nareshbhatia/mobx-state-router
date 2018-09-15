import * as React from 'react';
import { RouterState, RouterStore } from '../router-store';
import { routerStateToUrl } from '../adapters/generate-url';

function isLeftClickEvent(event: React.MouseEvent<HTMLElement>) {
    return event.button === 0;
}

function isModifiedEvent(event: React.MouseEvent<HTMLElement>) {
    return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
}

export interface LinkProps
    extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    routerStore: RouterStore;
    toState: RouterState;
    className?: string;
    activeClassName?: string;
}

/**
 * Creates an anchor tag that links to a router state. Redirects to the target
 * state without reloading the entire app, thus avoiding potential flickers.
 *
 * Example:
 *     const home = new RouterState('home');
 *     ...
 *     <Link routerStore={routerStore} toState={home}>
 *         Home
 *     </Link>
 *
 * Link accepts `className` and `activeClassName` as optional
 * properties. `className` is always applied to the anchor tag.
 * `activeClassName` is applied in addition if the current `routerState`
 * matches the state specified by the `Link`. This feature is
 * useful for highlighting the active link in a navbar.
 *
 * Note that you can pass other anchor tag attributes (such as onClick
 * and onBlur) to this component. They will be passed through to the
 * child anchor tag except for `href`, which is fully computed by this
 * component.
 *
 * @see RouterLink for simpler way to create anchor tags.
 */
export class Link extends React.Component<LinkProps, {}> {
    render() {
        const {
            routerStore,
            toState,
            className,
            activeClassName,
            children,
            href, // remove from `...others`
            onClick, // remove from `...others`
            ...others
        } = this.props;

        const isActive = routerStore.routerState.isEqual(toState);
        const joinedClassName =
            (className ? className : '') +
            (isActive && activeClassName ? ' ' + activeClassName : '');

        return (
            <a
                className={joinedClassName}
                href={routerStateToUrl(routerStore, toState)}
                onClick={this.handleClick}
                {...others}
            >
                {children}
            </a>
        );
    }

    handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        // Ignore if link is clicked using a modifier key or not left-clicked
        if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
            return undefined;
        }

        // Prevent default action which reloads the app
        event.preventDefault();

        const { routerStore, toState, onClick } = this.props;

        // Call onClick hook if present
        if (onClick) onClick(event);

        // Change the router state to trigger a refresh
        return routerStore.goTo(toState);
    };
}
