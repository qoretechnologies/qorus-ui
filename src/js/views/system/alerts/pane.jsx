import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { capitalize } from 'lodash';

import Pane from '../../../components/pane';
import InfoTable from '../../../components/info_table';
// import Table, { Section, Row, Cell } from '../../../components/table';


const alertSelector = (state, props) =>
  (state.api.alerts.data.find(a => a.alertid === parseInt(props.params.id, 10)));


const viewSelector = createSelector(
  [
    alertSelector,
  ],
  (alert) => ({
    alert,
  })
);


@connect(viewSelector)
export default class AlertPane extends Component {
  static propTypes = {
    alert: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    location: PropTypes.object,
    router: PropTypes.object,
    route: PropTypes.object,
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  onClose = () => {
    const pathArr = this.props.location.pathname.split('/');
    const newPath = pathArr.slice(0, pathArr.length - 1).join('/');

    this.context.router.push(newPath);
  }

  getData() {
    let data = [];

    for (const attr of attrs) {
      data.push({ attr, value: this.props.alert[attr] });
    }

    return data;
  }

  /**
   * Yields cells with capitalized attribute name and its value.
   *
   * @param {string} attr
   * @param {*} value
   * @return {Generator<ReactElement>}
   * @see renderValue
   */
  *renderCells({ attr, value }) {
    yield (
      <Cell tag="th">{capitalize(attr)}</Cell>
    );

    yield (
      <Cell>{this.renderValue(value)}</Cell>
    );
  }

  /**
   * Yields rows for table body.
   *
   * @param {Array<AttrValuePair>} data
   * @return {Generator<ReactElement>}
   * @see renderCells
   */
  *renderRows(data) {
    for (const attr of data) {
      yield (
        <Row data={attr} cells={this.renderCells} />
      );
    }
  }

  render() {
    return (
      <Pane width={400} onClose={ this.onClose }>
        <h3>Alert detail</h3>
        <InfoTable object={ this.props.alert } />
        {/* <Table data={this.props.alert}>
          <Section type="body" data={ this.getData() } rows={this.renderRows} />
        </Table>*/}
      </Pane>
    );
  }
}
