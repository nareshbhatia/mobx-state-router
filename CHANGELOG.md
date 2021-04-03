## 6.0.0-beta.2 (April 3, 2021)

When a route's transition hook returns a redirect state, we are now calling the
hooks for the redirected state's route also. See
[this discussion](https://github.com/nareshbhatia/mobx-state-router/issues/111).

## 6.0.0-beta.1 (October 26, 2020)

Updated dependency from mobx 5.x to mobx 6.0.0.

## 5.2.0 (July 26, 2020)

Changed build system to [TSDX](https://tsdx.io/).

## 5.1.1 (July 10, 2020)

Minor cleanup of RouterContext.

## 5.1.0 (July 4, 2020)

Added optional `altPatterns` property to `Route` to support legacy routes.
Legacy routes go one way only, from browser location to router state.

## 5.0.0 (May 23, 2020)

The overall theme of this release is to simplify the API and make it more
flexible. Consequently, there are a few breaking changes, but nothing very
drastic. You should be able to convert fairly large applications in an hour or
two! Please follow this change log and the [examples](examples) for guidance.

### RootStore requirement is removed

Earlier versions of the router assumed that `RouterStore` is part of a store
hierarchy with `RootStore` at the top. This turns out to be too opinionated and
is not required for proper functioning of the router. Consequently, the
`rootStore` parameter in `RouterStore` constructor has been removed. If you
indeed need the `rootStore` in the router (e.g. to use in your transition
hooks), you can pass it in via the new `options` parameter.

```diff
- const routerStore = new RouterStore(rootStore, routes, notFound);
+ const routerStore = new RouterStore(routes, notFound);
```

Here's how to pass the `rootStore` if you want to:

```diff
- const routerStore = new RouterStore(rootStore, routes, notFound);
+ const routerStore = new RouterStore(routes, notFound, { rootStore });
```

Here's how to retrieve the `rootStore` from the `routerStore:

```js
const { rootStore } = routerStore.options;

// Use rootStore to access other stores
const { orderStore } = rootStore as RootStore;
```

### Add RouterContext in App.tsx

In earlier versions, we provided the router to the view hierarchy using a
`RootStore` provider. Now we need to provide the router directly using its own
context. You may still use the `RootStoreContext` if you maintain a `RootStore`.
See example below:

```jsx
import { RouterContext, RouterView } from 'mobx-state-router';
import { RootStoreContext } from './contexts';

<RootStoreContext.Provider value={rootStore}>
    <RouterContext.Provider value={routerStore}>
        <RouterView viewMap={viewMap} />
    </RouterContext.Provider>
</RootStoreContext.Provider>;
```

### Retrieve router from context using the new useRouterStore hook

Example:

```jsx
import { useRouterStore } from 'mobx-state-router';

export const HomeButton = () => {
    const routerStore = useRouterStore();

    const handleClick = () => {
        routerStore.goTo('home');
    };

    return <button onClick={handleClick}>Home</button>;
};
```

### Remove routerStore prop from RouterView

It is no longer required.

```diff
- <RouterView routerStore={routerStore} viewMap={viewMap} />
+ <RouterView viewMap={viewMap} />
```

### RouterState is no longer a class

`RouterState` used to be a class which was instantiated using a constructor. Now
it is a simple JavaScript object. However, we recommend constructing it using
`createRouterState()`, a factory method provided by the library:

```diff
- const home = new RouterState('home');
+ const home = createRouterState('home');
```

`createRouterState()` takes a second parameter called options, where you can
pass `params` or `queryParams`. This is a change from before, but it results in
much more readable code (see
[options pattern](https://rclayton.silvrback.com/easy-class-api-options-with-typescript-and-joi)).
An added advantage is that you can send in your custom options and use them for
example in your transition hooks.

```diff
- const routerState = new RouterState(
    'department',
     { id: 'department', section: 'televisions' },
     { q: 'apple', items: ['E1', 'E2'] }
  );
+ const routerState = createRouterState(
     'department',
     {
         params: { id: 'department', section: 'televisions' },
         queryParams: { q: 'apple', items: ['E1', 'E2'] }
     }
  );
```

### RouterStore.goTo() uses options parameter

Along similar lines, the overloaded `RouterStore.goTo()` signature has been
broken into two (`goTo()` and `goToState()`) and simplified. The `goTo()` method
takes the same parameters as `createRouterState()` mentioned above and
internally calls that function to create the target state. See examples below:

```jsx
routerStore.goTo('home');
routerStore.goTo('department', { params: { id: 'electronics' } });

const department = createRouterState('department', {
    params: { id: 'electronics' },
});
routerStore.goToState(department);
```

### Simplify your transition hooks (in routes.ts)

1. Make them async functions
2. Do not throw from your hooks to redirect the transition, return a redirect
   state instead.

For example, replace code like this:

```
const routes = [
    {
        name: 'checkout',
        pattern: '/checkout',
        beforeEnter: (
            fromState: RouterState,
            toState: RouterState,
            routerStore: RouterStore
        ) => {
            if (authStore.user) {
                return Promise.resolve();
            } else {
                authStore.setSignInRedirect(toState);
                return Promise.reject(createRouterState('signin'));
            }
        }
    }
];
```

with this:

```
const routes = [
    {
        name: 'checkout',
        pattern: '/checkout',
        beforeEnter: async (
            fromState: RouterState,
            toState: RouterState,
            routerStore: RouterStore
        ) => {
            if (!authStore.user) {
                authStore.setSignInRedirect(toState);
                return createRouterState('signin');
            }
        }
    }
];
```

### Use browserHistory from mobx-state-router

In earlier versions, we used to create a history instance in the app, and
provided it to `HistoryAdapter` (this code spanned over two files):

```js
import { createBrowserHistory } from 'history';
import { HistoryAdapter } from 'mobx-state-router';

const history = createBrowserHistory();
const historyAdapter = new HistoryAdapter(routerStore, history);
```

mobx-state-router now provides you a simple instance of `browserHistory` as a
convenience. If you don't need any customization of the history object, just use
the one provided by mobs-state-router:

```
import { browserHistory, HistoryAdapter } from 'mobx-state-router';

const historyAdapter = new HistoryAdapter(routerStore, browserHistory);
```

### Link component has been dropped in favor of RouterLink

`RouterLink` is much more convenient to use anyway.

### RouterStore.setErrorHook() has been dropped

We now include debug statements that can be turned on at runtime. Simply go to
the Chrome Dev Tools console and enter this command:

```jsx
localStorage.debug = 'msr:*';
```
