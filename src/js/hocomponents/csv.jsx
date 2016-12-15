// @flow
import React from 'react';
import wrapDisplayName from 'recompose/wrapDisplayName';

import modal from './modal';
import Modal from '../components/modal';
import { generateCSV } from '../helpers/table';

export default (
  collection: string,
  name: string
): Function => (Component: ReactClass<*>): ReactClass<*> => {
  class WrappedComponent extends React.Component {
    props: {
      openModal: Function,
      closeModal: Function,
    };

    handleModalMount: Function = (): void => {
      document.querySelector('#CSV-modal-text').select();
    };

    handleCSVClick: Function = (): void => {
      this.props.openModal(
        <Modal onMount={this.handleModalMount}>
          <Modal.Header
            onClose={this.props.closeModal}
            titleId="CSV-modal"
          >
            Copy table
            <small> (Press ⌘ + c / CTRL + c) </small>
          </Modal.Header>
          <Modal.Body>
            <textarea
              rows="12"
              readOnly
              id="CSV-modal-text"
              className="form-control"
              value={generateCSV(this.props[collection], name)}
            />
          </Modal.Body>
        </Modal>
      );
    };

    render() {
      return (
        <Component onCSVClick={this.handleCSVClick} {...this.props} />
      );
    }
  }

  WrappedComponent.displayName = wrapDisplayName(Component, 'withCSV');

  return modal()(WrappedComponent);
};
