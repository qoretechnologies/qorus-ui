/**
 * @module types/system/react
 */


const React = require('react');


const System = React.PropTypes.shape({
  'instance-key': React.PropTypes.string.isRequired,
  'omq-version': React.PropTypes.string.isRequired,
  'omq-schema': React.PropTypes.string,
  'omq-build': React.PropTypes.number,
});


module.exports = System;
