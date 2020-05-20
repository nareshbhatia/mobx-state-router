---
id: api-router-state
title: RouterState
sidebar_label: RouterState
---

`RouterState` holds the state of the router. It is a simple object conforming to
the following interface. `RouterState` can be serialized and deserialized. This
is useful for server-side rendering.

```jsx
interface RouterState {
    // Example 'department'
    routeName: string;

    // Example { id: 'electronics' }
    params: StringMap;

    // Example { q: 'apple' } or { items: ['E1', 'E2'] }
    queryParams: { [key: string]: any };

    options: { [key: string]: any };
}
```

Never construct a `RouterState` from scratch, instead use the
`createRouterState()` factory method. Treat RouterState as immutable. If you
need a new RouterState, create a fresh one.

## createRouterState()

### Syntax

```jsx
const createRouterState = (
    routeName: string,
    options: { [key: string]: any } = {}
) => RouterState;
```

### Parameters

#### routeName

Example `'department'`

#### options

Array of key-value pairs to store into `RouterState`. The following options are
supported. However, you can pass additional options that you may want to use in
transition hooks.

```jsx
params: StringMap
    Example { id: 'electronics' }
```

```jsx
queryParams: { [key: string]: any }
    Example { q: 'apple' } or { items: ['E1', 'E2'] }
```

```jsx
replaceHistory: boolean
    If true, the router uses history.replace() when transitioning to a new state.
    The default is to use history.push().
```

### Return value

An instance of `RouterState`.
