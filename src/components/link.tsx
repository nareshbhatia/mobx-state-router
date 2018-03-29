import * as React from 'react';
import { RouterState, RouterStore } from '../router-store';
import { routerStateToUrl } from '../adapters/generate-url';

function isLeftClickEvent(event: React.MouseEvent<HTMLElement>) {
    return event.button === 0;
}

function isModifiedEvent(event: React.MouseEvent<HTMLElement>) {
    return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
}

export interface LinkProps {
    routerStore: RouterStore;
    toState: RouterState;
}

/**
 * Creates an <a> element that links to a router state. Redirects to the target
 * state without reloading the entire app, thus avoiding potential flickers.
 */
export class Link extends React.Component<LinkProps, {}> {
    render() {
        const { routerStore, toState, children } = this.props;
        return (
            <a
                href={routerStateToUrl(routerStore, toState)}
                onClick={this.handleClick}
            >
                {children}
            </a>
        );
    }

    handleClick = (event: React.MouseEvent<HTMLElement>) => {
        // Ignore if link is clicked using a modifier key or not left-clicked
        if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
            return undefined;
        }

        // Prevent default action which reloads the app
        event.preventDefault();

        // Change the router state to trigger a refresh
        const { routerStore, toState } = this.props;
        return routerStore.goTo(toState);
    };
}
