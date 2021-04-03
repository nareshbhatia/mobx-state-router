# MobX State Router

[![npm](https://img.shields.io/npm/v/mobx-state-router?style=plastic)](https://www.npmjs.com/package/mobx-state-router)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Travis](https://img.shields.io/travis/alexjoverm/typescript-library-starter.svg)](https://travis-ci.org/nareshbhatia/mobx-state-router)
[![Coverage Status](https://coveralls.io/repos/github/nareshbhatia/mobx-state-router/badge.svg?branch=master)](https://coveralls.io/github/nareshbhatia/mobx-state-router?branch=master)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

MobX-powered router for React apps.

## Features

-   State is decoupled from the UI. UI is simply a function of the state.
-   UI is no longer responsible for fetching data. Data is now fetched during
    state transitions using router hooks.
-   The router can override routing requests based on the application state. For
    example, it can redirect to the Sign In page if the user is not logged in.
-   Supports
    -   404 (Not Found) errors
    -   Server-Side Rendering

[Learn how to use mobx-state-router in your own project.](https://nareshbhatia.github.io/mobx-state-router/)

## Contributors

Make sure all your commit messages conform to the
[Angular Commit Message Conventions](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines).

To simplify this process, we have included
[Commitizen](http://commitizen.github.io/cz-cli/) as a dependency of this
project. Always execute the following command sequence to commit your changes.
It will prompt you to fill out any required commit fields interactively.

```
git add --all
yarn cz-commit # interactive conventional commit
git push
```

## Testing local builds

To test local builds with examples in the `examples` folder, follow the steps
listed below:

-   Build the package

```bash
yarn build:local  # creates a dist folder
```

-   Create a tarball from the package

```bash
npm pack  # packages src and dist into a tarball with name [package-name]-[version].tgz
```

-   Go to an example in the examples directory and add the tarball as a
    dependency

```bash
cd examples/mobx-shop
yarn add ../../[package-name]-[version].tgz
```

-   Run the example

```bash
yarn start
```

## Release to NPM

-   Change the version number in package.json. Use semver. For pre-release
    versions add a suffix & build number, e.g 5.0.0-beta.1.

-   Commit and push (see above)

-   Build the package

```bash
yarn build:local
```

-   Release to npm

```bash
npm publish             # for normal release (adds `latest` tag)
npm publish --tag next  # for pre-release (adds `next` tag)
```

-   Tag the release and push the tag to remote

## Publishing docs to GitHub Pages

Make sure you are
[connected to GitHub using your SSH key](https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh).

```sh
cd website
yarn
GIT_USER=nareshbhatia CURRENT_BRANCH=master USE_SSH=true yarn publish-gh-pages
```

## Credits

mobx-state-router is based on ideas from several Open Source projects. I am
grateful to the developers of these projects for their contributions. Special
thanks go to the following contributions:

[How to decouple state and UI (a.k.a. you don’t need componentWillMount)](https://hackernoon.com/how-to-decouple-state-and-ui-a-k-a-you-dont-need-componentwillmount-cc90b787aa37)\
This article by [Michel Weststrate](https://twitter.com/mweststrate) provided the
initial inspiration for writing mobx-state-router. It explains the downsides of mixing
State and UI and how to untangle the mess!

[mobx-router](https://github.com/kitze/mobx-router)\
This library by [Kitze](https://github.com/kitze) is a good implementation of Michel
Weststrate's ideas. I have borrowed some concepts from this implementation and then
added my own. Thanks Kitze!

[router5](https://github.com/router5/router5)\
This is a more extensive library for routing. It's unique feature is that routes
are organized as a tree, made of segments and nodes. It aims to be framework agnostic
and uses middleware and plugins to adapt to different frameworks. Of course, with
flexibility comes complexity. mobx-state-router makes some choices for you to keep
the overall learning curve simple.
