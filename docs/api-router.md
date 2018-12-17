---
id: api-router
title: Router
sidebar_label: Router
---

mobx-state-router is written in TypeScript, with rich type information embedded right inside the code. When in doubt, look at the exported interfaces and classes - they are fairly easy to understand. In this section we highlight the key interfaces and classes.

## RouterState

`RouterState` consists of `routeName`, `params` and `queryParams`. Always use the constructor to create an instance of the `RouterState`. Once an instance is created, don't mutate it - create a fresh instance instead.

```jsx
export class RouterState {
    constructor(
        readonly routeName: string,
        readonly params: StringMap = {},
        readonly queryParams: Object = {}
    );
}
```

## Route

A `Route` consists of a name, a URL matching pattern and optional enter/exit hooks. The `RouterStore` is initialized with an array of routes which it uses to transition between states.

```jsx
export interface TransitionHook {
    (
        fromState: RouterState,
        toState: RouterState,
        routerStore: RouterStore
    ): Promise<void>;
}

export interface Route {
    name: string; // e.g. 'department'
    pattern: string; // e.g. '/departments/:id'
    beforeExit?: TransitionHook;
    beforeEnter?: TransitionHook;
    onExit?: TransitionHook;
    onEnter?: TransitionHook;
}
```

## RouterStore

The `RouterStore` is the keeper of the `RouterState`. It allows transitioning between states using the `goTo()` method.

```jsx
export interface JsRouterState {
    routeName: string;
    params?: StringMap;
    queryParams?: Object;
}

export interface ErrorHook {
    (err: Error): any;
}

export class RouterStore {
    @observable.ref routerState: RouterState;
    @observable isTransitioning: boolean = false;

    constructor(
        rootStore: any,
        routes: Route[],
        notFoundState: RouterState,
        initialState?: JsRouterState
    );
    hydrate(state: JsRouterState);
    serialize(): JsRouterState;
    setErrorHook(onError: ErrorHook);
    goTo(toState: RouterState): Promise<RouterState>;
    goTo(
        routeName: string,
        params?: StringMap,
        queryParams?: Object
    ): Promise<RouterState>;
    goTo(
        toStateOrRouteName: RouterState | string,
        params: StringMap = {},
        queryParams: Object = {}
    ): Promise<RouterState>;
    goToNotFound(): Promise<RouterState>;
    getRoute(routeName: string): Route;
    getCurrentRoute(): Route;
}
```

The `goTo()` method calls the optional `TransitionHook`s before transitioning to the final state. Any of the hooks can prevent the transition to the final state by returning a `Promise.reject(someOtherState)`. In this case the router will immediately transition to `someOtherState` without calling the remaining hooks.

The `RouterStore` exposes two observable properties:

-   routerState: the state of the router
-   isTransitioning: set to true when the router is in the process of transitioning from one state to another. This property can be used, for example, to display a progress indicator during transitions.

The `RouterStore` allows you to set a custom error hook using the `setErrorHook()` method. This hook is called if any unexpected error occurs when transitioning states. You can set this hook, for example, to transition to an error page.

The `serialize()` method serializes the state of the router to a plain JavaScript object. The `hydrate()` method does the reverse - it initializes the router using a plain JavaScript object. These methods are useful in server-side rendering.

## HistoryAdapter

The `HistoryAdapter` is responsible for keeping the browser address bar and the `RouterState` in sync. It also provides a `goBack()` method to go back in history.

```jsx
export class HistoryAdapter {
    constructor(routerStore: RouterStore, history: History);
    goToLocation = (location: Location): Promise<RouterState>;
    goBack();
}
```

## StaticAdapter

The `StaticAdapter` is responsible for driving `RouterState` programmatically instead of the Browser bar. This is useful in server-side rendering scenarios where the user isn’t actually clicking around, so the location never actually changes. Hence, the name `static`.

```jsx
export class StaticAdapter {
    constructor(routerStore: RouterStore);
    goToLocation = (location: Location): Promise<RouterState>;
}
```
