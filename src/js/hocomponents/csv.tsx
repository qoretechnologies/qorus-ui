// @flow
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import wrapDisplayName from 'recompose/wrapDisplayName';
import Modal from '../components/modal';
import { generateCSV } from '../helpers/table';
import modal from './modal';

export default (collection: string, name: string): Function =>
  (
    // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'ReactClass'.
    Component
    // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'ReactClass'.
  ) => {
    @injectIntl
    class WrappedComponent extends React.Component {
      props: {
        openModal: Function;
        closeModal: Function;
      } = this.props;

      handleModalMount: Function = (): void => {
        const el: any = document.querySelector('#CSV-modal-text');

        // @ts-ignore ts-migrate(2339) FIXME: Property 'select' does not exist on type 'Object'.
        if (el) el.select();
      };

      handleCSVClick: Function = (): void => {
        this.props.openModal(
          <Modal onMount={this.handleModalMount}>
            <Modal.Header onClose={this.props.closeModal} titleId="CSV-modal">
              <FormattedMessage id="global.copy-table" />
              <small> (Press ⌘ + c / CTRL + c) </small>
            </Modal.Header>
            <Modal.Body>
              <textarea
                // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'number'.
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

    // @ts-ignore ts-migrate(2339) FIXME: Property 'displayName' does not exist on type 'typ... Remove this comment to see the full error message
    WrappedComponent.displayName = wrapDisplayName(Component, 'withCSV');

    return modal()(WrappedComponent);
  };
