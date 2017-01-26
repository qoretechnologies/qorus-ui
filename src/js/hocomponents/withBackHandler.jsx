// @flow
import React from 'react';
import wrapDisplayName from 'recompose/wrapDisplayName';

export default (): Function => (Component: ReactClass<*>): ReactClass<*> => {
  class WrappedComponent extends React.Component {
    handleBackClick: Function = (ev: EventHandler): void => {
      ev.preventDefault();

      history.go(-1);
    };

    render() {
      return (
        <Component
          onBackClick={this.handleBackClick}
          {...this.props}
        />
      );
    }
  }

  WrappedComponent.displayName = wrapDisplayName(Component, 'withBackHandler');

  return WrappedComponent;
};
