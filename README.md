# Qorus Webapp Interface

## Technology Stack

Webapp uses [React](https://facebook.github.io/react/),
[Redux](http://redux.js.org) (with React bindings),
[React Router](https://www.npmjs.com/package/react-router) and
[Bootstrap](http://getbootstrap.com). JavaScript is compiled with
[Babel](http://babeljs.io) with stage-0 preset and legacy decorators
plugin. Stylesheets are compiled with
[Sass](http://sass-lang.com). Resulting static assets are put together
by [webpack](http://webpack.github.io).

There are two levels of tests following behavior-driven development
practices. Acceptance tests are written in
[Cucumber.js](https://cucumber.io/docs/reference/javascript) with
[Zombie](http://zombie.js.org). Unit tests in
[Mocha](http://mochajs.org) with [Chai](http://chaijs.com).

There is also a development and test server written in
[Express](http://expressjs.com).


## Structure

### `src`

The main directory with source code and
[app entry point](src/index.jsx) for the webapp. Most of other things
are just support for development or build.

### `src/js/components`

Reusable React components specific to the webapp. If necessary,
components have stylesheets there. The stylesheets are imported by the
[main CSS file](src/css/app.scss).

### `src/js/views`

Application of reusable components and general elements to create the
whole UI. Internal structure reflects navigation and/or URL
structure. Stylesheets for views are defined in `src/css` unlike
components.

### `src/js/store`

Redux store, reducers and actions.

### `types`

Type definitions in [JSDoc](http://usejsdoc.org),
[JSON Schema](http://json-schema.org) and
[React PropTypes](http://facebook.github.io/react/docs/reusable-components.html#prop-validation).

### `features`

Acceptance tests in Cucumber.js.

### `test`

Unit test in Mocha.

### `fixtures`

Static data for tests.

### `server.js` and `api`

Development and test server implementation in Express.

### `webpack.config.js`, `webpack.config`, `cucumber.js` and dot-files

Configuration of development, test and build environment with webpack,
its loaders and other utilities.


## Getting Started

This is not a typical behavior-driven approach, but it is the fastest
way the get started.

Please note that in this example, a virtual machine with Qorus server
installed is accessible via qorus.vm.dev hostname. This requires
additional configuration. Different approach is to use port-forwarding
in which case you would replace qorus.vm.dev with localhost and
additional specify or correct a port number.

Make sure your code and dependencies are up-to-date:

```bash
git pull --rebase
npm install
```

Run Qorus:

```bash
VBoxManage startvm Qorus --type headless
ssh qorus.vm.dev qorus
```

Run development server (defaults are: `HOST=localhost`, `PORT=3000`,
`API_PROTO=http`, `API_HOST=localhost` and `API_PORT=8001`):

```bash
API_HOST=qorus.vm.dev npm start
```

Open the webapp:

```bash
open http://localhost:3000
```

Do your changes and run tests:

```bash
npm test
```

Check you coding style:

```bash
npm run lint
```

Commit and push your changes to
[Qore repository](https://git.qoretechnologies.com/ui/qorus-webapp). You
can review status of integrated effort of the team in
[Jenkins](https://hq.qoretechnologies.com/jenkins/job/qorus-webapp-react/).


## Environment Variables

### `NODE_ENV`

There three main values:

- `development`: good defaults for "classic" web development (change
  code, verify in browser). React is compiled in development mode
  (props type checking, various other checks,
  ...). [React performance tools](http://facebook.github.io/react/docs/perf.html)
  are accessible via `Perf` global variable in the browser. Redux
  DevTools are enabled. Hot module replacement applies new code
  changes minimazing necessity to reload the page manually. If API
  proxy is not used, generated fake API is provided.

- `test`: good for running tests and behavior- or test-driven
  development. React is compiled in production mode. Test
  instrumentation which dispatches `WebappDomUpdate` event when React
  finishes DOM updated or `WebappRouterUpdate` event when route is
  updated. If API proxy is not used, static mock API is provided.

- `production`: good for production build and performance
  testing. React is compiled in production mode. Everything is
  minified. No additional are not present.

### `API_PROTO`, `API_HOST` and `API_PORT`

Causes REST and WebSocket API proxy to be created instead of generated
fake or static mock API.

### `REST_BASE_URL`

Overrides any `API_*` variable and causes REST API proxy to be
created. If this variable is not explictly specified, but any of
`API_*` variable is, the value default to
`${API_PROTO}://${API_HOST}:${API_PORT}/api` where `API_PROTO`
defaults to http, `API_HOST` to localhost and `API_PORT` to 8001.

### `WS_BASE_URL`

Overrides any `API_*` variable and causes WebSocket API proxy to be
created. If this variable is not explictly specified, but any of
`API_*` variable is, the value default to `${API_PROTO === 'https' ?
'wss' : 'ws'}://${API_HOST}:${API_PORT}` where `API_PROTO` defaults to
http, `API_HOST` to localhost and `API_PORT` to 8001.

### `HOST` and `PORT`

Changes host and port to which the server binds. Host defaults to
localhost which almost certainly results to listening on loopback
(e.g., 127.0.0.1). Port defaults to 3000.

### `TEST_SITE`

Specifies webapp base URL for acceptance tests. It defaults to
`http://${HOST}:${POST}` (see above).


## Running Tests

### Acceptance & Integration Tests

Cucumber scenarios are quite slow to run due to spinning up mock API
server, DOM polling and TCP/IP communication (although on
loopback). It is suggested to:

- mark scenarios you are working on with `@wip` tag
- spin up mock API server aside
- run only `@wip` scenarios

Open new terminal and run WIP scenarios with built-in test server:

```bash
PORT=3001 npm run test:uat:wip
```

When you change you code, Nodemon reruns the test suite again. `PORT`
environment variable is specified to prevent collision with default
value which is normally used in development mode.

### Unit Tests

Mocha specs are fast, do not require anything else to be running and
Mocha itself has a great capabilities to provide immediate feedback
during development.

Open new terminal window and run Mocha in watch mode.

```bash
npm run test:unit:wip
```

When you change you code, Mocha reruns the test suite again.


## Code Style

[Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
is followed when applicable - which is practically
everywhere. [ESLint](http://eslint.org) cannot check everything and in
certain cases acts quite strangely (because of AST provided by Babel
compiler and experimental features) it may be reasonable to turn off
some checks. So, find your esthetic self or discuss it with the team.

Custom stylesheets follow
[CSS Guidelines by Harry Roberts](http://cssguidelin.es), which is the
main source of rather vague
[Airbnb CSS / Sass Styleguide](https://github.com/airbnb/css).
