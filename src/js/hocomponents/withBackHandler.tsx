// @flow
import React from 'react';
import wrapDisplayName from 'recompose/wrapDisplayName';

// @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'ReactClass'.
export default (): Function => (Component) => {
  class WrappedComponent extends React.Component {
    // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
    handleBackClick: Function = (ev: EventHandler): void => {
      ev.preventDefault();

      history.go(-1);
    };

    render() {
      return <Component onBackClick={this.handleBackClick} {...this.props} />;
    }
  }

  // @ts-ignore ts-migrate(2339) FIXME: Property 'displayName' does not exist on type 'typ... Remove this comment to see the full error message
  WrappedComponent.displayName = wrapDisplayName(Component, 'withBackHandler');

  return WrappedComponent;
};
