/* @flow */
import React, { PropTypes } from 'react';
import _ from 'lodash';


/**
 * Returns high order component that calls load function on component did mount
 * if props[propName] is undefined
 */
export default (
  propName: string,
  propType: any
) => (
  Component: ReactClass<{}>
) => {
  class WrappedComponent extends React.Component {

    componentDidMount() {
      if (_.isUndefined(this.props[propName])) {
        this.props.load();
      }
    }

    render() {
      return <Component {...this.props} />;
    }
  }
  WrappedComponent.propTypes = {
    load: PropTypes.func.isRequired,
    [propName]: propType,
  };

  const displayName = `loadIfUndeinfed(${propName})(${Component.displayName})`;
  WrappedComponent.displayName = displayName;

  return WrappedComponent;
};
