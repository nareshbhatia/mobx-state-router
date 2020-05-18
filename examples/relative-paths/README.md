# Hosting an app at a relative path

This example shows how to host an app at a relative path instead of the server
root, e.g. at `http://archfirst.org/myapp` instead of `http://archfirst.org`.
The trick to doing this is to set the `basename` option when creating the
`history` object.

In this example, we are setting `homepage` in package.json so that the app is
hosted at `/myapp` instead of root:

    "homepage": "http://archfirst.org/myapp"

We are setting the `basename` option in `utils/history`:

    const history = createBrowserHistory({
        basename: "/myapp"
    });

## Development

```bash
$ yarn
$ yarn start
```

Now point your browser to http://localhost:3000/myapp.

Note: This works because we have specified `homepage` in package.json.

    "homepage": "http://archfirst.org/myapp",

## Production

```bash
# Build the client first
# This creates a deploy directory at 'deploy' with the app at 'deploy/myapp'
$ yarn build

# Serve the app
$ yarn serve
```

Point your browser to http://localhost:3000/myapp/. This loads the home page.

Point your browser to http://localhost:3000/myapp/about. This loads the about
page. This is the critical test because server does not physically have a page
at /myapp/about.html. The page is served from /myapp/index.html. See code in
server/index.html.
