import React, { Component, PropTypes } from 'react';

import { includes } from 'lodash';

import ErrorsTable from './table';
import ErrorsToolbar from './toolbar';
import CSVModal from '../../errors/csv';
import { pureRender } from 'components/utils';
import PaneItem from '../../../../components/pane_item';

import { generateCSV, sortTable } from 'helpers/table';

@pureRender
export default class DiagramErrors extends Component {
  static propTypes = {
    data: PropTypes.array,
  };

  static contextTypes = {
    openModal: PropTypes.func,
    closeModal: PropTypes.func,
    selectModalText: PropTypes.func,
  };

  componentWillMount() {
    this.setState({
      data: this.props.data,
      showDetail: false,
      severity: ['ALL'],
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      this.filter(nextProps.data, this.state.severity);
    }
  }

  filter(errors, severity) {
    const data = errors.filter(
      d => includes(severity, d.severity) || includes(severity, 'ALL')
    );

    this.setState({
      data,
      severity,
    });
  }

  handleDropdownSubmit = severity => {
    this.filter(this.props.data, severity);
  };

  handleShowDetailClick = () => {
    this.setState({
      showDetail: true,
    });
  };

  handleCSVClick = () => {
    this.openCSVModal(generateCSV(this.props.data, 'order_errors_pane'));
  };

  handleCopyLastClick = () => {
    const sorted = sortTable(this.props.data, {
      sortBy: 'created',
      sortByKey: { direction: -1 },
    });
    const data = this.stringifyError(sorted[0]);

    this.openCSVModal(data);
  };

  openCSVModal = data => {
    this._modal = (
      <CSVModal
        onMount={this.context.selectModalText}
        onClose={this.handleModalCloseClick}
        data={data}
      />
    );

    this.context.openModal(this._modal);
  };

  handleModalCloseClick = () => {
    this.context.closeModal(this._modal);
  };

  stringifyError: Function = (data: Object): string =>
    Object.keys(data).reduce(
      (str, key) => `${str}${key}: ${data[key]}\r\n`,
      ''
    );

  render() {
    return (
      <PaneItem title="Errors">
        <ErrorsToolbar
          data={this.props.data}
          showDetail={this.state.showDetail}
          onCSVClick={this.handleCSVClick}
          onShowDetailClick={this.handleShowDetailClick}
          onHideDetailClick={this.handleHideDetailClick}
          onSubmit={this.handleDropdownSubmit}
          onCopyErrorClick={this.handleCopyLastClick}
        />
        <ErrorsTable
          data={this.state.data}
          expand={this.state.showDetail}
          onModalMount={this.context.selectModalText}
        />
      </PaneItem>
    );
  }
}
