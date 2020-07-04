---
id: api-route
title: Route
sidebar_label: Route
---

A `Route` is a pattern that is used to match a URL. Routes are identified by
unique names, e.g. `home` and `about`. Routes can also specify alternate
patterns to match legacy URLs.

Routes can optionally specify hooks to perform actions when entering or exiting
the associated route.

```jsx
type TransitionHook = (
    fromState: RouterState,
    toState: RouterState,
    routerStore: RouterStore
) => Promise<RouterState | void>;

interface Route {
    /** route name, e.g. 'department' */
    name: string;

    /** route matching pattern, e.g. '/departments/:id' */
    pattern: string;

    /**
     * Alternate route matching patterns. These support legacy routes
     * and go one way only, from browser location to router state.
     */
    altPatterns?: Array<string>;

    // Enter/exit hooks
    beforeExit?: TransitionHook;
    beforeEnter?: TransitionHook;
    onExit?: TransitionHook;
    onEnter?: TransitionHook;
}
```

## Examples

```jsx
{
    name: 'home',
    pattern: '/'
}
```

```jsx
{
    name: 'department',
    pattern: '/departments/:id',
    onEnter: async (
        fromState: RouterState,
        toState: RouterState,
        routerStore: RouterStore
    ) => {
        // load department items on entry
        const { rootStore } = routerStore.options;
        const { itemStore } = rootStore as RootStore;
        itemStore.loadDepartmentItems(toState.params.id);
    },
}
```
