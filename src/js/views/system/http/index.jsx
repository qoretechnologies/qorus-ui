/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import compose from 'recompose/compose';
import _ from 'lodash';

import Table, { Section, Cell, Row } from '../../../components/table';
import actions from '../../../store/api/actions';
import sync from '../../../hocomponents/sync';

const userHttpMetaSelector = (state: Object): Object => {
  if (state.api.userhttp) {
    return {
      sync: state.api.userhttp.sync,
      loading: state.api.userhttp.loading,
    };
  }

  return { sync: false, loading: false };
};

const userHttpSelector = (state:Object): Array<Object> => {
  if (state.api.userhttp) {
    const col = [];

    Object.keys(state.api.userhttp.data)
      .forEach((key) => col.push(state.api.userhttp.data[key]));

    return col;
  }
  return [];
};

const tablesSelector = (state: Object): Array<string> => (
  [..._.uniq(state.api.userhttp.data.map(r => r.group))]
);

const viewSelector = createSelector(
  [
    userHttpSelector,
    userHttpMetaSelector,
    tablesSelector,
  ],
  (userhttp: Array<Object>, meta: Object, tables: Array<string>) => ({
    meta,
    tables,
    collection: userhttp,
  })
);


@compose(
  connect(
    viewSelector,
    { load: actions.userhttp.fetch }
  ),
  sync('meta')
)
export default class UserHttp extends Component {
  props: {
    collection: Array<Object>,
    tables: Array<string>,
  };

  componentWillMount() {
    this._renderCells = this.renderCells.bind(this);
    this._renderRows = this.renderRows.bind(this);
  }

  _renderCells: any;
  _renderRows: any;


  *renderCells(row: Object): Generator<*, *, *> {
    yield(
      <Cell>
        <a href={ row.url } target="blank">{ row.title }</a>
      </Cell>
    );

    yield(
      <Cell>
        { row.service } {row.version} #{row.serviceid }
      </Cell>
    );
  }

  *renderRows(collection: Array<Object>): Generator<*, *, *> {
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

  *renderTables(): Generator<*, *, *> {
    const collection = this.props.collection;
    const tables = this.props.tables;

    for (const table of tables) {
      yield (
      <div key={table}>
        <h3>{ table }</h3>
        <Table className="table table-data table-striped table-condensed">
          <Section
            type="body"
            data={ collection.filter((m) => m.group === table) }
            rows={this._renderRows}
          />
        </Table>
      </div>
      );
    }
  }

  render() {
    const { tables } = this.props;

    if (tables.length === 0) {
      return (
        <div>
          No Http Services Available
        </div>
      );
    }
    return (
      <div>
        { React.Children.toArray(this.renderTables()) }
      </div>
    );
  }
}
