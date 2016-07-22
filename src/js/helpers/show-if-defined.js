/* @flow */
import React, { PropTypes } from 'react';
import _ from 'lodash';


export default (
  propName: string,
  propType: any
) => (
  Component: React.Component
) => {
  class WrappedComponent extends React.Component {
    render() {
      if (_.isUndefined(this.props[propName])) {
        return null;
      }
      return <Component {...this.props} />;
    }
  }
  WrappedComponent.propTypes = {
    [propName]: propType,
  };

  const displayName = `showIfDefined(${propName})(${Component.displayName})`;
  WrappedComponent.displayName = displayName;
  return WrappedComponent;
};
