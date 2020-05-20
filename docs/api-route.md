---
id: api-route
title: Route
sidebar_label: Route
---

A `Route` is a pattern that is used to match a URL. Routes are identified by
unique names, e.g. `home` and `about`. They can also specify hooks that can be
used to perform actions when entering or exiting routes.

```jsx
type TransitionHook = (
    fromState: RouterState,
    toState: RouterState,
    routerStore: RouterStore
) => Promise<RouterState | void>;

interface Route {
    name: string; // e.g. 'department'
    pattern: string; // e.g. '/departments/:id'
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
