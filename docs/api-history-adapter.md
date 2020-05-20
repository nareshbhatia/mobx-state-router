---
id: api-history-adapter
title: HistoryAdapter
sidebar_label: HistoryAdapter
---

The `HistoryAdapter` keeps the browser address bar in sync with the
`RouterState`.

```jsx
class HistoryAdapter {
    constructor(routerStore: RouterStore, history: History);

    // go to the specified location
    goToLocation = (location: Location): Promise<RouterState>;

    // go back in history
    goBack();

    // observe browser address bar and router state and keep them in sync
    observeRouterStateChanges();
}
```
