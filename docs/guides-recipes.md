---
id: guides-recipes
title: Recipes
sidebar_label: Recipes
---

This section describes mobx-state-router recipes for some common routing
scenarios.

## Fetching Data

As mentioned before, UI should not be responsible for fetching data. This means
no data fetching in `componentWillMount()` or `componentDidMount()`. Lately
React allows fetching data using hooks, which is somewhat better. However,
mobx-state-router facilitates data fetching completely out of the view
hierarchy. You can do this using the `onEnter` transition hook. This hook is
called just before a new router state is entered and is the perfect place to
kick off a data fetch. Here's
[an example](https://github.com/nareshbhatia/mobx-state-router/blob/master/examples/mobx-shop/src/stores/routes.ts#L45-L57)
from MobX Shop:

```jsx
{
    name: 'department',
    pattern: '/departments/:id',
    onEnter: async (
        fromState: RouterState,
        toState: RouterState,
        routerStore: RouterStore
    ) => {
        const { rootStore } = routerStore.options;
        const { itemStore } = rootStore as RootStore;
        itemStore.loadDepartmentItems(toState.params.id);
    },
},
```

This code is part of route definitions. We define an `onEnter` hook that calls
`itemStore.loadDepartmentItems()` to kick off the fetching process. The hook
does not have to wait for the fetch to complete (note no `await`). The
`itemStore` can maintain state to indicate the status of the fetch. After
calling `itemStore.loadDepartmentItems()`, the hook returns, allowing the router
proceed to the target state.

## Redirecting to the Sign In page

If the user is not logged in, we can direct them to a Sign In page. Not only
that, we can direct them back to the requested page upon a successful sign in.
For example, in MobX Shop, we allow the user to add items to the shopping cart
without having to sign in. However they can't proceed to checkout unless signed
in. This is achieved by using the `beforeEnter` hook in the route configuration.
Here's
[the code](https://github.com/nareshbhatia/mobx-state-router/blob/master/examples/mobx-shop/src/stores/routes.ts#L40-L44)
from MobX Shop:

```jsx
{
    name: 'checkout',
    pattern: '/checkout',
    beforeEnter: checkForUserSignedIn
}
```

`checkForUserSignedIn()` is a shared transition hook used by multiple routes. It
is defined in the
[routes.js](https://github.com/nareshbhatia/mobx-state-router/blob/master/examples/mobx-shop/src/stores/routes.ts#L40-L44)
file:

```jsx
const checkForUserSignedIn = async (
    fromState: RouterState,
    toState: RouterState,
    routerStore: RouterStore
) => {
    const { rootStore } = routerStore.options;
    const { authStore } = rootStore as RootStore;
    if (!authStore.user) {
        authStore.setSignInRedirect(toState);
        return signin;
    }
};
```

This hook allows the router to proceed if the user is already signed in. If not,
the requested state is saved in `authStore` and the app is redirected to the
`signin` state. On a successful sign in, `authStore` redirects the app to the
originally requested state. Here's
[the code](https://github.com/nareshbhatia/mobx-state-router/blob/master/examples/mobx-shop/src/stores/AuthStore.ts#L20-L23)
from MobX Shop:

```jsx
setUser = (user: User) => {
    this.user = user;
    this.rootStore.routerStore.goToState(this.signInRedirect);
};
```

## Creating Links

You will notice that anchor tags used for linking to internal pages cause a
flicker when clicked. That's because such links reload the entire app! We need
to prevent the default handling of these links and let the router handle the
redirects. This can be done using the `<RouterLink>` component provided by the
router. Here's
[an example](https://github.com/nareshbhatia/mobx-state-router/blob/master/examples/relative-paths/src/components/Header.tsx)
of a page header with links to the Home and About pages:

```jsx
import React from 'react';
import { RouterLink } from 'mobx-state-router';
import './Header.css';

export const Header = () => (
    <header>
        <ul className="navbar">
            <li>
                <RouterLink routeName="home" activeClassName="link--active">
                    Home
                </RouterLink>
            </li>
            <li>
                <RouterLink routeName="about" activeClassName="link--active">
                    About
                </RouterLink>
            </li>
        </ul>
    </header>
);
```

`RouterLink` accepts `className` and `activeClassName` as optional properties.
`className` is always applied to the generated anchor tag. `activeClassName` is
applied in addition if the current `routerState` matches the state specified by
the `RouterLink`. This feature is useful for highlighting the active link in a
navbar.
