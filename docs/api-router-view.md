---
id: api-router-view
title: RouterView
sidebar_label: RouterView
---

The `RouterView` component watches the router state and instantiates the
associated UI component. It expects a `viewMap` prop, which is a simple mapping
from `routeNames` to React components (or more generally `ReactNodes`).

```jsx
interface ViewMap {
    [routeName: string]: React.ReactNode;
}

interface RouterViewProps {
    viewMap: ViewMap;
}

const RouterView: React.FC<RouterViewProps> = () => {...}
```
