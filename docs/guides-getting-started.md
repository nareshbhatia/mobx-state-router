---
id: guides-getting-started
title: Getting Started
sidebar_label: Getting Started
---

Welcome! We’re excited that you’ve decided to learn mobx-state-router. This tutorial will guide you through building your first React app with mobx-state-router.

The finished app will consist of two simple pages: Home (shown below) and Electronics. Clicking the _Go to Electronics_ button on the Home page will take you to the Electronics page. Clicking the _Go Home_ button on the Electronics page will take you back to the Home page. That's it!

![Quick Start App](assets/screen-shot-quick-start.png)

We have the [finished example](https://github.com/nareshbhatia/mobx-state-router-quick-start) in Github, so if you get stuck, check out the working code there.

## Create React App

Create a simple React app using [create-react-app](https://github.com/facebookincubator/create-react-app).

## Install mobx-state-router

Install the router and its peer dependencies:

    npm install --save mobx-state-router history mobx mobx-react

Note that mobx-state-router does not require you to switch all your state management to MobX. If you are already using other state management libraries in your app (such as Redux), you can continue to use them, only the router will use MobX.

Define Routes

---

Let's first define our routes, the `RouterStore` will need them. By convention we define our routes in [src/shared/stores/routes.js](https://github.com/nareshbhatia/mobx-state-router-quick-start/blob/master/src/shared/stores/routes.js). We will keep our route configuration very simple for right now. Let's define three routes: `home`, `department` and `notFound`:

```jsx
// Routes are matched from top to bottom. Make sure they are sequenced
// in the order of priority. It is generally best to sort them by pattern,
// prioritizing specific patterns over generic patterns (patterns with
// one or more parameters). For example:
//     /items
//     /items/:id
export const routes = [
    {
        name: 'home',
        pattern: '/'
    },
    {
        name: 'department',
        pattern: '/departments/:id'
    },
    {
        name: 'notFound',
        pattern: '/not-found'
    }
];
```

## Define RootStore

We will use the [best practices](https://mobx.js.org/best/store.html#combining-multiple-stores) described in the MobX documentation to create our stores. According to this document, an effective way to structure our stores is to create a `RootStore` that instantiates all other stores and shares their references. So let's create this `RootStore` and let it instantiate the `RouterStore`. By convention, we define the `RootStore` in [src/shared/stores/root.store.js](https://github.com/nareshbhatia/mobx-state-router-quick-start/blob/master/src/shared/stores/root.store.js). Add the following code to this file. Note that the `RouterStore` expects the `RootStore`, the routes and the `notFound` state as the parameters of its constructor.

```jsx
import { RouterState, RouterStore } from 'mobx-state-router';
import { routes } from './routes';

const notFound = new RouterState('notFound');

export class RootStore {
    routerStore = new RouterStore(this, routes, notFound);
}
```

## Create RootStore & HistoryAdapter

The next step is to create the `RootStore` and the `HistoryAdapter`.

`HistoryAdapter` is responsible for keeping the browser address bar in sync with the `RouterState`. It depends on the [history](https://github.com/ReactTraining/history) library to manage the browser history. It needs a `history` object in the constructor, so let's create it first. By convention, we create the history object in [src/shared/utils/history.js](https://github.com/nareshbhatia/mobx-state-router-quick-start/blob/master/src/shared/utils/history.js). Add the following code to your `history.js` file:

```jsx
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();
```

We are now ready to create the `RootStore` and the `HistoryAdapter`. By convention, we do this in [src/App.js](https://github.com/nareshbhatia/mobx-state-router-quick-start/blob/master/src/App.js):

```jsx
import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import { HistoryAdapter } from 'mobx-state-router';
import { RootStore } from './shared/stores/root.store';
import { history } from './shared/utils/history';
import { Shell } from './shell';

// Create the rootStore
const rootStore = new RootStore();

// Observe history changes
const historyAdapter = new HistoryAdapter(rootStore.routerStore, history);
historyAdapter.observeRouterStateChanges();

class App extends Component {
    render() {
        return (
            <Provider rootStore={rootStore}>
                <Shell />
            </Provider>
        );
    }
}

export default App;
```

Here we create an instance of the `RootStore` and give it to the MobX `Provider`. The `Provider` makes the `RootStore` (and hence the `RouterStore`) available to any nested component via React context. We also create the `HistoryAdapter` and ask it to observe route changes.

## Create RouterView

The next step is to create the `RouterView` which is responsible for instantiating the UI component associated with the state of the router. By convention, we create it in the `Shell` located in [src/shell.js](https://github.com/nareshbhatia/mobx-state-router-quick-start/blob/master/src/shell.js). Add the following code to this file:

```jsx
import React from 'react';
import { inject } from 'mobx-react';
import { RouterView } from 'mobx-state-router';
import { DepartmentPage } from './features/department/department-page';
import { HomePage } from './features/home/home-page';
import { NotFoundPage } from './features/not-found-page';

const viewMap = {
    department: <DepartmentPage />,
    home: <HomePage />,
    notFound: <NotFoundPage />
};

export const Shell = inject('rootStore')(
    class extends React.Component {
        render() {
            const { rootStore } = this.props;
            const { routerStore } = rootStore;

            return <RouterView routerStore={routerStore} viewMap={viewMap} />;
        }
    }
);
```

Here we instantiate the `RouterView` in the `render()` method. We supply the `routerStore` as a prop along with a `viewMap`. The `RouterView` uses the `viewMap` to instantiate views based on the router state. Note that we are injecting the `rootStore` into the Shell using the MobX `inject` method. If you have enabled decorators as described in the [MobX docs](https://mobx.js.org/best/decorators.html#enabling-decorators), you can use the nicer decorator syntax as we have done in [MobX Shop](https://github.com/nareshbhatia/mobx-shop.git).

## Create Pages

The final step is to create the pages themselves. Here's the code for them:

[src/features/home/home-page.js](https://github.com/nareshbhatia/mobx-state-router-quick-start/blob/master/src/features/home/home-page.js)

```jsx
import React from 'react';
import { inject } from 'mobx-react';

const styles = {
    root: {
        padding: 16
    }
};

export const HomePage = inject('rootStore')(
    class extends React.Component {
        render() {
            return (
                <div style={styles.root}>
                    <h1>Home</h1>
                    <button onClick={this.handleClick}>
                        Go to Electronics
                    </button>
                </div>
            );
        }

        handleClick = () => {
            const { rootStore } = this.props;
            rootStore.routerStore.goTo('department', { id: 'electronics' });
        };
    }
);
```

The home page has a button that allows the user to navigate to the Electronics department. Note the call to `routerStore.goTo()` to transition to the `department` route with parameter `id` set to `electronics`.

[src/features/department/department-page.js](https://github.com/nareshbhatia/mobx-state-router-quick-start/blob/master/src/features/department/department-page.js)

```jsx
import React from 'react';
import { inject } from 'mobx-react';

const styles = {
    root: {
        padding: 16
    }
};

export const DepartmentPage = inject('rootStore')(
    class extends React.Component {
        render() {
            const { rootStore } = this.props;
            const { params } = rootStore.routerStore.routerState;

            return (
                <div style={styles.root}>
                    <h1>Welcome to {params.id}</h1>
                    <button onClick={this.handleClick}>Go Home!</button>
                </div>
            );
        }

        handleClick = () => {
            const { rootStore } = this.props;
            rootStore.routerStore.goTo('home');
        };
    }
);
```

The department page has a button that allows the user to navigate to home. Note the call to `routerStore.goTo()` to transition to the `home` state.

[src/features/not-found-page.js](https://github.com/nareshbhatia/mobx-state-router-quick-start/blob/master/src/features/not-found-page.js)

```jsx
import React from 'react';

const styles = {
    root: {
        padding: 16
    }
};

export function NotFoundPage() {
    return (
        <div style={styles.root}>
            <h1>Page Not Found</h1>
        </div>
    );
}
```

## Start Your App

Your React app is now ready for prime time! Execute `npm start` on your command line and point your browser to http://localhost:3000. You will see the home page. Click on the button to go to the Electronics page (watch the URL change). Now enter an invalid URL in the browser address bar, e.g. http://localhost:3000/junk. The router will automatically navigate to the not found page.

Now that you have a taste of the basics, you can try out some advanced scenarios. Go to the Recipes section to explore. You can also look at [MobX Shop](https://github.com/nareshbhatia/mobx-shop.git) for a more realistic app.
