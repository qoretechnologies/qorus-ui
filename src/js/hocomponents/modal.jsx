/* @flow */
import PropTypes from 'prop-types';
import React from 'react';
import wrapDisplayName from 'recompose/wrapDisplayName';

/**
 * A high-order component that provides an easy access to
 * opening and closing a modal
 */
export default (): Function => (Component: ReactClass<*>): ReactClass<*> => {
  class ComponentWithModal extends React.Component {
    static contextTypes = {
      openModal: PropTypes.func.isRequired,
      closeModal: PropTypes.func.isRequired,
    };

    modal: ?ReactClass<*> = null;

    handleOpenModal: Function = (Modal: ReactClass<*>): void => {
      this.modal = Modal;

      this.context.openModal(this.modal);
    };

    handleCloseModal: Function = (): void => {
      this.context.closeModal(this.modal);
    };

    render() {
      return (
        <Component
          openModal={this.handleOpenModal}
          closeModal={this.handleCloseModal}
          {...this.props}
        />
      );
    }
  }

  ComponentWithModal.displayName = wrapDisplayName(Component, 'hasModal');

  return ComponentWithModal;
};
