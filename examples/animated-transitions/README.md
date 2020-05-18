# Animated Page Transitions

This example shows how to animate page transitions using mobx-state-router. We
are using the
[react-transition-group](https://reactcommunity.org/react-transition-group/)
library for page animations. Watch
[this video](https://www.youtube.com/watch?v=53Y8q-SgLF0) to understand the
basics.

The heart of the implementation is in `shell.tsx`:

```
render() {
    ...
    const routeName = routerStore.routerState.routeName;
    const view = viewMap[routeName];

    return (
        <TransitionGroup component={null}>
            <CSSTransition
                key={routerStore.routerState.routeName}
                timeout={250}
                classNames="fade"
            >
                {view}
            </CSSTransition>
        </TransitionGroup>
    );
}
```

Here we determine the view that should be rendered based on the router's state.
The view is wrapped in `TransitionGroup`. Whenever the route changes and a new
view is rendered, the `TransitionGroup` orchestrates a transition between the
old view and the new view.

## Quick Start

```bash
yarn        # or npm install
yarn start  # or npm start
```

Now point your browser to http://localhost:3000/.
