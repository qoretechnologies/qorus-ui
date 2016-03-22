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

### `src/components`

Reusable React components specific to the webapp.

### `src/views`

Application of reusable components and general elements to create the
whole UI. Internal structure reflects navigation and/or URL structure.

### `src/store`

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

### `webpack.config.js`, `webpack.config` and dot-files

Configuration of development, test and build environment with webpack
and its loaders.


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
