import React, { Component, PropTypes } from 'react';

import { includes } from 'lodash';

import ErrorsTable from './table';
import ErrorsToolbar from './toolbar';
import { pureRender } from 'components/utils';
import PaneItem from '../../../../components/pane_item';

@pureRender
export default class DiagramErrors extends Component {
  static propTypes = {
    data: PropTypes.array,
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
