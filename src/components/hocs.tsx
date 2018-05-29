import * as React from 'react';
import { observer } from 'mobx-react';
import { RouterState, RouterStore, StringMap } from '../router-store';
import { routerStateToUrl } from '../adapters/generate-url';

export interface AnchorProps {
    href?: string;
    onClick?: (event: React.MouseEvent<HTMLElement>) => any;
}

export interface WithStoreProps {
    routerStore: RouterStore;
}

export interface WithRouterProps extends WithStoreProps {
    toState: RouterState | string;
    params?: StringMap;
    queryParams?: Object;
}

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
type Subtract<T, K> = Omit<T, keyof K>;

const isLeftClickEvent = (event: React.MouseEvent<HTMLElement>) =>
    event.button === 0;

const isModifiedEvent = (event: React.MouseEvent<HTMLElement>) =>
    !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

// FIXME: Need documentation
export const withRouter = <P extends AnchorProps, K extends keyof P>(
    Component: React.ComponentType<P>,
    activePropName?: K
): React.ComponentType<Subtract<P, AnchorProps> & WithRouterProps> => {
    @observer
    class WithRouterLink extends React.Component<
        Subtract<P, AnchorProps> & WithRouterProps
    > {
        static displayName = `WithRouter(${Component.displayName ||
            Component.name})`;

        handleClick = (event: React.MouseEvent<HTMLElement>) => {
            // Ignore if link is clicked using a modifier key or not left-clicked
            if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
                return undefined;
            }

            // Prevent default action which reloads the app
            event.preventDefault();

            // Change the router state to trigger a refresh
            const { routerStore, toState, params, queryParams } = this
                .props as WithRouterProps;

            const to =
                typeof toState === 'string'
                    ? new RouterState(toState, params, queryParams)
                    : toState;

            return routerStore.goTo(to);
        };

        render() {
            const {
                routerStore,
                toState,
                params,
                queryParams,
                ...props
                // until resolved https://github.com/Microsoft/TypeScript/pull/13288
            } = this.props as WithRouterProps;

            const to =
                typeof toState === 'string'
                    ? new RouterState(toState, params, queryParams)
                    : toState;

            const href = routerStateToUrl(routerStore, to);
            const active = activePropName
                ? {
                      [activePropName]: routerStore.routerState.isEqual(to)
                  }
                : {};

            return (
                <Component
                    {...props}
                    href={href}
                    onClick={this.handleClick}
                    {...active}
                />
            );
        }
    }
    return WithRouterLink;
};

// FIXME: Need documentation
export const withStore = <P extends WithStoreProps>(
    Component: React.ComponentType<P>,
    routerStore: RouterStore
): React.SFC<Subtract<P, WithStoreProps>> => props => (
    <Component {...props} routerStore={routerStore} />
);
