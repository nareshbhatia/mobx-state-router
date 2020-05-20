---
id: api-router-store
title: RouterStore
sidebar_label: RouterStore
---

The `RouterStore` is the keeper of the `RouterState`. It allows transitioning
between states using `goTo` methods.

```jsx
class RouterStore {
    routes: Route[];
    notFoundState: RouterState;
    routerState: RouterState;
    options: { [key: string]: any };

    constructor(
        routes: Route[],
        notFoundState: RouterState,
        options: { [key: string]: any } = {}
    )

    goTo(
        routeName: string,
        options: { [key: string]: any } = {}
    ): Promise<RouterState>

    goToState(toState: RouterState): Promise<RouterState>

    goToNotFound(): Promise<RouterState>

    getRoute(routeName: string): Route | undefined

    getCurrentRoute(): Route | undefined

    getNotFoundRoute(): Route
}
```

## constructor()

### Syntax

```jsx
constructor(
    (routes: Route[]),
    (notFoundState: RouterState),
    (options: { [key: string]: any } = {})
);
```

### Parameters

#### routes

An array of routes that will be used by the router to transition between states.

#### notFoundState

The state the router will transition to if it does not know about a requested
target state.

#### options

Array of key-value pairs to store in `RouterStore`. The following option is
supported. However, you can pass additional options that you may want to use in
transition hooks.

```jsx
initialState: RouterState
    The initial state of the router. If not specified, the router
    will be initialized to an internal default state and will wait
    for history to drive the next state.
```

## goTo()

Transitions to the state specified by the `routeName` and `options`. Calls
optional `TransitionHook`s before transitioning to the final state. Any of the
hooks can prevent the transition to the final state by returning a redirect
state. In this case the router will immediately transition to the redirect state
without calling the remaining hooks.

### Syntax

```jsx
goTo(
    routeName: string,
    options: { [key: string]: any } = {}
): Promise<RouterState>;
```

### Parameters

#### routeName

The route to transition to.

#### options

Array of key-value pairs to help construct the target state. The following
options are supported. However, you can pass additional options that you may
want to use in transition hooks.

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

## goToState()

Same as `goTo()` except that the target state needs to be fully constructed
outside of the method and passed in.

### Syntax

```jsx
goToState(toState: RouterState): Promise<RouterState>;
```

### Parameters

#### toState

The state to transition to.

## goToNotFound()

Transition to the notFound state.

### Syntax

```jsx
goToNotFound(): Promise<RouterState>;
```

## getRoute()

Returns the route associated with the specified routeName or `undefined` if the
route does not exist.

### Syntax

```jsx
getRoute(routeName: string): Route | undefined;
```

## getCurrentRoute()

Returns the current route specified by the router state or `undefined` if the
route does not exist.

### Syntax

```jsx
getCurrentRoute(): Route | undefined;
```

## getNotFoundRoute()

Returns the notFound route.

### Syntax

```jsx
getNotFoundRoute(): Route;
```
