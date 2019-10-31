/* @flow */
import React from 'react';

import { Control } from '../controls';
import Modal from '../modal';
import { generateCSV } from '../../helpers/table';
import modal from '../../hocomponents/modal';
import { injectIntl, FormattedMessage } from 'react-intl';

@modal()
@injectIntl
class CsvExport extends React.Component {
  props: {
    collection: Array<Object>,
    openModal: Function,
    closeModal: Function,
    type: string,
  } = this.props;

  _modal: React$Element<*>;

  handleCsvOpen = () => {
    const { collection, type, closeModal } = this.props;
    this._modal = (
      <Modal onMount={this.selectCSVContent}>
        <Modal.Header onClose={closeModal} titleId="csv-modal">
          <FormattedMessage id='global.copy-table' />
          <small> (Press ⌘ + c)</small>
        </Modal.Header>
        <Modal.Body>
          <textarea
            rows="12"
            readOnly
            id="csv-text"
            className="form-control"
            value={generateCSV(collection, type)}
          />
        </Modal.Body>
      </Modal>
    );
    this.props.openModal(this._modal);
  };

  selectCSVContent = () => {
    // $FlowIssue
    document.getElementById('csv-text').select();
  };

  render () {
    return (
      <Control
        btnStyle="default"
        onClick={this.handleCsvOpen}
        label="CSV"
        big
      />
    );
  }
}

export default CsvExport;
