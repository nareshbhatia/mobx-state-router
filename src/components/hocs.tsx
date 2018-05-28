import * as React from 'react';
import { observer } from 'mobx-react';
import { RouterState, RouterStore, StringMap } from '../router-store';
import { routerStateToUrl } from '../adapters/generate-url';

const isLeftClickEvent = (event: React.MouseEvent<HTMLElement>) =>
    event.button === 0;

const isModifiedEvent = (event: React.MouseEvent<HTMLElement>) =>
    !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

export interface LinkProps {
    href?: string;
    onClick?: (event: React.MouseEvent<HTMLElement>) => any;
}

export interface RouterStoreProps {
    routerStore: RouterStore;
}

export interface WithRouterProps extends RouterStoreProps {
    toState: RouterState | string;
    params?: StringMap;
    queryParams?: Object;
}

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
type Subtract<T, K> = Omit<T, keyof K>;

// FIXME: Need documentation
export const withRouter = <P extends LinkProps>(
    Component: React.ComponentType<P>,
    activePropName?: string
): React.ComponentType<Subtract<P, LinkProps> & WithRouterProps> => {
    @observer
    class WithRouterLink extends React.Component<
        Subtract<P, LinkProps> & WithRouterProps
    > {
        static displayName = `WithRouter(${Component.displayName ||
            Component.name})`;

        handleClick = (event: React.MouseEvent<HTMLElement>) => {
            // Ignore if link is clicked using a modifier key or not left-clicked
            if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
                return;
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
export const withStore = <P extends RouterStoreProps>(
    Component: React.ComponentType<P>,
    routerStore: RouterStore
) => (props: Subtract<P, RouterStoreProps>) => (
    <Component {...props} routerStore={routerStore} />
);
