---
id: api-router-link
title: RouterLink
sidebar_label: RouterLink
---

The `<RouterLink>` component creates an anchor tag that transitions to the
specified router state when clicked. It does so without reloading the entire
app, thus avoiding potential flickers.

```jsx
interface RouterLinkProps {
    routeName: string;
    params?: StringMap;
    queryParams?: { [key: string]: any };
    className?: string;
    activeClassName?: string;
}

const RouterLink: React.FC<RouterLinkProps> = () => {...};
```

`RouterLink` accepts `className` and `activeClassName` as optional properties to
control the look of the link in normal and active states.

You can pass other anchor tag attributes (such as onClick and onBlur) to this
component. They will be passed through to the child anchor tag except for
`href`, which is fully computed by this component.
