---
id: api-components
title: Components
sidebar_label: Components
---

This section describes React components supplied with mobx-state-router.

## RouterView

The `RouterView` component watches the router state and instantiates the associated UI component. It expects two props: the `routerStore` and a `viewMap`. The `viewMap` is a simple mapping from `routeNames` to React components (or more generally `ReactNodes`).

```jsx
export interface ViewMap {
    [routeName: string]: React.ReactNode;
}

export interface RouterViewProps {
    routerStore: RouterStore;
    viewMap: ViewMap;
}

@observer
export class RouterView extends React.Component<RouterViewProps, {}> {...}
```

## Link

The `Link` component creates an anchor tag that links to a router state. It redirects to the target state without reloading the entire app, thus avoiding potential flickers.

`Link` accepts `className` and `activeClassName` as optional properties to control the look of the link in normal and active states.

```jsx
export interface LinkProps
    extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    routerStore: RouterStore;
    toState: RouterState;
    className?: string;
    activeClassName?: string;
}

export class Link extends React.Component<LinkProps, {}> {...}
```

You can pass other anchor tag attributes (such as onClick and onBlur) to this component. They will be passed through to the child anchor tag except for `href`, which is fully computed by this component.

See RouterLink below for simpler way to create anchor tags.

## RouterLink

`<RouterLink>` is a simpler variation of `<Link>` that does not require the `routerStore` parameter. Also `toState` can be specified using simpler properties: `routeName`, `params` and `queryParams`.

`RouterLink` accepts `className` and `activeClassName` as optional properties to control the look of the link in normal and active states.

Note that the `rootStore` property is injected into the `RouterLink`. There is no need to supply it in your tags.

```jsx
export interface RouterLinkProps
    extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    rootStore?: any;
    routeName: string;
    params?: StringMap;
    queryParams?: Object;
    className?: string;
    activeClassName?: string;
}

export class RouterLink extends React.Component<RouterLinkProps, {}> {...}
```

You can pass other anchor tag attributes (such as onClick and onBlur) to this component. They will be passed through to the child anchor tag except for `href`, which is fully computed by this component.
