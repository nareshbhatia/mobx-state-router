---
id: api-static-adapter
title: StaticAdapter
sidebar_label: StaticAdapter
---

The `StaticAdapter` drives `RouterState` programmatically (as oppsed to manually
by the Browser bar). This is useful in server-side rendering scenarios where the
user isn’t actually clicking around, so the location never actually changes.
Hence, the name `static`.

```jsx
class StaticAdapter {
    constructor(routerStore: RouterStore);

    // go to the specified location
    goToLocation = (location: Location): Promise<RouterState>;
}
```
