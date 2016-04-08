'use strict';


const defaults = [
  '--compiler js:babel-register',
  '--compiler jsx:babel-register',
  '--snippet-syntax features/support/babel_syntax.js',
];

module.exports = {
  default: [
    '--compiler js:babel-register',
    '--compiler jsx:babel-register',
    '--snippet-syntax features/support/babel_syntax.js',
  ].join(' '),
  ci: defaults.concat([
    '--no-colors',
    '--tags ~@no-impl',
  ]).join(' '),
  wip: defaults.concat([
    '--format summary',
    '--tags @wip',
  ]).join(' '),
};
