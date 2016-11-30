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

const userHttpSelector = (state:Object): Array<Object> => state.api.userhttp.data;

const viewSelector = createSelector(
  [
    userHttpSelector,
    userHttpMetaSelector,
  ],
  (userhttp: Array<Object>, meta: Object) => ({
    meta,
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
    collection: Object,
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
    const groups = Object.keys(collection);

    for (const group of groups) {
      yield (
        <div key={group}>
          <h3>{ group }</h3>
          <Table className="table table-data table-striped table-condensed">
            <Section
              type="body"
              data={ collection[group] }
              rows={this._renderRows}
            />
          </Table>
        </div>
      );
    }
  }

  render() {
    const { collection } = this.props;

    if (Object.keys(collection).length === 0) {
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
