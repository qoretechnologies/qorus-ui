/* @flow */
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { compose } from 'redux';
import { generateCSV } from '../../helpers/table';
import modal from '../../hocomponents/modal';
import { Control } from '../controls';
import Modal from '../modal';

class CsvExport extends React.Component {
  props: {
    collection: Array<Object>;
    openModal: Function;
    closeModal: Function;
    type: string;
  } = this.props;

  // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'React$Element'.
  _modal: React$Element<any>;

  handleCsvOpen = () => {
    const { collection, type, closeModal } = this.props;
    this._modal = (
      <Modal onMount={this.selectCSVContent}>
        <Modal.Header onClose={closeModal} titleId="csv-modal">
          <FormattedMessage id="global.copy-table" />
          <small> (Press ⌘ + c)</small>
        </Modal.Header>
        <Modal.Body>
          <textarea
            // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'number'.
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
    // @ts-ignore ts-migrate(2551) FIXME: Property 'select' does not exist on type 'HTMLElem... Remove this comment to see the full error message
    document.getElementById('csv-text').select();
  };

  render() {
    return <Control btnStyle="default" onClick={this.handleCsvOpen} label="CSV" big />;
  }
}

export default compose(injectIntl, modal)(CsvExport);
