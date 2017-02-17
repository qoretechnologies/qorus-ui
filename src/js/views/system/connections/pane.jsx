import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { capitalize } from 'lodash';

import Pane from '../../../components/pane';
import Table, { Section, Row, Cell } from '../../../components/table';
import AutoComponent from '../../../components/autocomponent';

const remoteSelector = (state, props) => (
  state.api.remotes.data.find(a => a.name === props.paneId)
);

const attrsSelector = (state, props) => {
  const type = props.type;
  let attrs;

  switch (type) {
    case 'datasources': {
      attrs = [
        'conntype',
        'locked',
        'up',
        'monitor',
        'status',
        'last_check',
        'type',
        'user',
        'db',
      ];

      break;
    }
    case 'qorus': {
      attrs = [
        'conntype',
        'up',
        'monitor',
        'status',
      ];

      break;
    }
    default: {
      attrs = [
        'conntype',
        'up',
        'monitor',
        'status',
        'last_check',
        'type',
      ];

      break;
    }
  }

  return attrs;
};

const viewSelector = createSelector(
  [
    remoteSelector,
    attrsSelector,
  ],
  (remote, attrs) => ({
    remote,
    attrs,
  })
);

@connect(viewSelector)
export default class ConnectionsPane extends Component {
  static propTypes = {
    remote: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    attrs: PropTypes.array,
    type: PropTypes.string,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  componentWillMount() {
    this._renderCells = ::this.renderCells;
    this._renderRows = ::this.renderRows;
  }

  getData() {
    const data = [];

    for (const attr of this.props.attrs) {
      data.push({ attr, value: this.props.remote[attr] });
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
      <Cell><AutoComponent>{ value }</AutoComponent></Cell>
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
        <Row data={attr} cells={this._renderCells} />
      );
    }
  }

  render() {
    return (
      <Pane width={400} onClose={this.props.onClose}>
        <h3>{ this.props.remote.name } detail</h3>
        <Table data={ this.getData() } className="table table-stripped table-condensed">
          <Section type="body" data={this.getData()} rows={this._renderRows} />
        </Table>
      </Pane>
    );
  }
}
