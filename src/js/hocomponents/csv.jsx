// @flow
import React from 'react';
import wrapDisplayName from 'recompose/wrapDisplayName';

import modal from './modal';
import Modal from '../components/modal';
import { generateCSV } from '../helpers/table';
import { injectIntl, FormattedMessage } from 'react-intl';

export default (collection: string, name: string): Function => (
  Component: ReactClass<*>
): ReactClass<*> => {
  @injectIntl
  class WrappedComponent extends React.Component {
    props: {
      openModal: Function,
      closeModal: Function,
    } = this.props;

    handleModalMount: Function = (): void => {
      const el: Object = document.querySelector('#CSV-modal-text');

      if (el) el.select();
    };

    handleCSVClick: Function = (): void => {
      this.props.openModal(
        <Modal onMount={this.handleModalMount}>
          <Modal.Header onClose={this.props.closeModal} titleId="CSV-modal">
            <FormattedMessage id='global.copy-table' />
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
      return <Component onCSVClick={this.handleCSVClick} {...this.props} />;
    }
  }

  WrappedComponent.displayName = wrapDisplayName(Component, 'withCSV');

  return modal()(WrappedComponent);
};
