import React from 'react';

/* @flow */
import PropTypes from 'prop-types';
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

    componentWillUnmount() {
      window.removeEventListener('keyup', this.handleEscPress);
    }

    handleOpenModal: Function = (Modal: ReactClass<*>): void => {
      this.modal = Modal;

      // Register keyboard events
      window.addEventListener('keyup', this.handleEscPress);

      this.context.openModal(this.modal);
    };

    handleCloseModal: Function = (): void => {
      this.context.closeModal(this.modal);
      window.removeEventListener('keyup', this.handleEscPress);
    };

    handleEscPress = (event) => {
      event.stopPropagation();

      if (event.key === 'Escape') {
        this.handleCloseModal();
      }
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
