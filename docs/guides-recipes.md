---
id: guides-recipes
title: Recipes
sidebar_label: Recipes
---

This section describes mobx-state-router recipes for some common routing scenarios.

## Fetching Data

As mentioned before, UI should not be responsible for fetching data. This means no data fetching in `componentWillMount()` or `componentDidMount()`. mobx-state-router facilitates data fetching during state transitions using the `onEnter` hook. This hook is called just before a new router state is entered and is the perfect place to kick off a data fetch. Here's [an example from MobX Shop](https://github.com/nareshbhatia/mobx-shop/blob/master/src/shared/stores/routes.js):

```jsx
{
    name: 'department',
    pattern: '/departments/:id',
    onEnter: (fromState, toState, routerStore) => {
        const { rootStore: { itemStore } } = routerStore;
        itemStore.loadDepartmentItems(toState.params.id);
        return Promise.resolve();
    }
},
```

This code is part of route definitions. We define an `onEnter` hook that calls `itemStore.loadDepartmentItems()` to kick off the fetching process. It does not have to wait for the fetch to complete. The `itemStore` maintains an `isLoading` flag to indicate the status of the fetch. The last line in the `onEnter` hook resolves the promise to let the router proceed to `toState`.

## Redirecting to the Sign In page

If the user is not logged in, we can redirect them to a Sign In page. Not only that, we can redirect them back to the requested page on a successful sign in. For example, in MobX Shop, we allow the user to add items to the shopping cart without having them sign in. However they can't proceed to checkout unless they are signed in. This is achieved by using the `beforeEnter` hook in the route configuration. Here's [the code](https://github.com/nareshbhatia/mobx-shop/blob/master/src/shared/stores/routes.js) from MobX Shop:

```jsx
{
    name: 'checkout',
    pattern: '/checkout',
    beforeEnter: checkForUserSignedIn
}
```

`checkForUserSignedIn()` is a shared function used by multiple routes. It is defined in the [routes.js](https://github.com/nareshbhatia/mobx-shop/blob/master/src/shared/stores/routes.js) file:

```jsx
const checkForUserSignedIn = (fromState, toState, routerStore) => {
    const {
        rootStore: { authStore }
    } = routerStore;
    if (authStore.user) {
        return Promise.resolve();
    } else {
        authStore.setSignInRedirect(toState);
        return Promise.reject(new RouterState('signin'));
    }
};
```

This function allows the router to proceed if the user is already signed in. If not, the requested state is saved in `authStore` and the app is redirected to the `signin` state. On a successful sign in, `authStore` redirects the app to the originally requested state. Here's [the code](https://github.com/nareshbhatia/mobx-shop/blob/master/src/shared/stores/auth.store.js) from MobX Shop:

```jsx
@action
setUser(user) {
    this.user = user;
    this.rootStore.routerStore.goTo(this.signInRedirect);
}
```

## Creating Links

You will notice that anchor tags used for linking to internal pages cause a flicker when clicked. That's because such links reload the entire app! We need to prevent the default handling of these links and let the router handle the redirect. This can be done using the `<Link>` component provided by the router. Here's an example of linking to the home page:

```jsx
import { Link, RouterState } from 'mobx-state-router';

function Footer({ routerStore }) {
    const toState = new RouterState('home');
    return (
        <div>
            <Link routerStore={routerStore} toState={toState}>
                Home
            </Link>
        </div>
    );
}
```

`<RouterLink>` is a simpler variation of `<Link>` that does not require the `routerStore` parameter. Also `toState` can be specified using simpler properties: `routeName`, `params` and `queryParams`. For example, the link shown above can be specified using `RouterLink` as follows:

```jsx
import { RouterLink } from 'mobx-state-router';

function Footer() {
    return (
        <div>
            <RouterLink routeName="home">Home</RouterLink>
        </div>
    );
}
```

Both `Link` & `RouterLink` accept `className` and `activeClassName` as optional properties. `className` is always applied to the generated anchor tag. `activeClassName` is applied in addition if the current `routerState` matches the state specified by the `RouterLink`. This feature is useful for highlighting the active link in a navbar.
