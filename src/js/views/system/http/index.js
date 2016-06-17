import React, { PropTypes, Component } from 'react';

import Table, { Section, Cell, Row } from '../../../components/table';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import actions from 'store/api/actions';

const userHttpMetaSelector = (state) => {
  if (state.api.userhttp) {
    return {
      sync: state.api.userhttp.sync,
      loading: state.api.userhttp.loading,
    };
  }

  return { sync: false, loading: false };
};

const userHttpSelector = (state) => {
  if (state.api.userhttp) {
    let col = [];

    Object.keys(state.api.userhttp.data)
      .forEach((key) => col.push(state.api.userhttp.data[key]));

    return col;
  }
  return [];
};

const tablesSelector = (state) => (
  [... new Set(state.api.userhttp.data.map(r => r.group))]
);

const viewSelector = createSelector(
  [
    userHttpSelector,
    userHttpMetaSelector,
    tablesSelector,
  ],
  (userhttp, meta, tables) => ({
    collection: userhttp,
    sync: meta.sync,
    loading: meta.loading,
    tables,
  })
);


@connect(viewSelector)
export default class UserHttp extends Component {
  static propTypes = {
    collection: PropTypes.array.isRequired,
    tables: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this._renderCells = ::this.renderCells;
    this._renderRows = ::this.renderRows;

    this.props.dispatch(actions.userhttp.fetch());
  }

  *renderCells(row) {
    yield(
      <Cell>
        <a href={ row.url } blank>{ row.ttle }</a>
      </Cell>
    );

    yield(
      <Cell>
        { row.service } {row.version} {row.serviceid }
      </Cell>
    );
  }

  *renderRows(collection) {
    for (const model of collection) {
      yield (
        <Row
          key={model.url}
          data={ model }
          cells={this._renderCells}
        />
      );
    }
  }

  *renderTables() {
    const collection = this.props.collection;
    const tables = this.props.tables;

    for (const table of tables) {
      yield (
      <div key={table}>
        <h3>{ table }</h3>
        <Table className="table table-data table-striped table-condensed">
          <Section
            type="body"
            data={ collection.filter((m) => m.group === name)}
            rows={this._renderRows}
          />
        </Table>
      </div>
      );
    }
  }

  render() {
    console.log(this.renderTables());
    return (
      <div>
        { this.renderTables() }
      </div>
    );
  }
}
