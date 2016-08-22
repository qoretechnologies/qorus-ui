/* @flow */
import React, { PropTypes } from 'react';

import { Control } from '../controls';
import Modal from '../modal';
import { generateCSV } from '../../helpers/table';


class CsvExport extends React.Component {
  static contextTypes = {
    openModal: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
  };

  props: {
    collection: Array<Object>,
    type: string,
  };

  _modal: React.Element<*>;

  handleCsvOpen = () => {
    const { collection, type } = this.props;
    this._modal = (
      <Modal
        onMount={this.selectCSVContent}
      >
        <Modal.Header
          onClose={this.handleCSVCloseClick}
          titleId="csv-modal"
        >
          Copy table
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
    this.context.openModal(this._modal);
  }

  handleCSVCloseClick = () => {
    this.context.closeModal(this._modal);
  }

  selectCSVContent = () => {
    document.getElementById('csv-text').select();
  };

  render() {
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
