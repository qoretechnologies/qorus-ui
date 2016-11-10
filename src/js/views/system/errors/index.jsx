/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';

import Table, { Section, Row, Cell } from '../../../components/table';
import AutoComponent from '../../../components/autocomponent';
import Toolbar from '../../../components/toolbar';
import Search from '../../../components/search';
import patch from '../../../hocomponents/patchFuncArgs';
import sort from '../../../hocomponents/sort';
import sync from '../../../hocomponents/sync';
import search from '../../../hocomponents/search';
import apiActions from '../../../store/api/actions';
import { sortDefaults } from '../../../constants/sort';
import { querySelector } from '../../../selectors/';
import { findBy } from '../../../helpers/search';

const errorsMetaSelector = (state: Object): Object => {
  if (state.api.errors.global) {
    return {
      sync: state.api.errors.global.sync,
      loading: state.api.errors.global.loading,
    };
  }

  return { sync: false, loading: false };
};

const errorsSelector = (state: Object): Array<Object> => {
  const col = [];
  if (state.api.errors.global) {
    Object.keys(state.api.errors.global.data)
      .forEach((key) => col.push(state.api.errors.global.data[key]));
  }
  return col;
};

const filterErrors: Function = (query: string): Function =>
  (collection: Array<Object>): Array<Object> => (
  findBy(['error', 'severity', 'type', 'description'], query, collection)
);

const errors = createSelector(
  [
    errorsSelector,
    querySelector('q'),
  ], (err, q) => filterErrors(q)(err)
);

const viewSelector = createSelector(
  [
    errors,
    errorsMetaSelector,
    querySelector('q'),
  ],
  (collection: Array<Object>, meta: Object, query: string): Object => ({
    meta,
    collection,
    query,
  })
);

@compose(
  connect(
    viewSelector,
    {
      load: apiActions.errors.fetch,
    }
  ),
  defaultProps({
    errorType: 'global',
  }),
  patch('load', ['errorType']),
  sort(
    'errors',
    'collection',
    sortDefaults.errors
  ),
  sync('meta'),
  search()
)
export default class Errors extends Component {
  props: {
    collection: Array<Object>,
    sortData: Object,
    onSortChange: Function,
    query: string,
    onSearchChange: Function,
    defaultSearchValue: string,
  };

  componentWillMount() {
    this._renderHeadingRow = this.renderHeadingRow.bind(this);
    this._renderRows = this.renderRows.bind(this);
    this._renderCells = this.renderCells.bind(this);
    this._renderHeadings = this.renderHeadings.bind(this);
  }

  _renderHeadingRow:? Function = null;
  _renderRows:? Function = null;
  _renderCells:? Function = null;
  _renderHeadings:? Function = null;

  /**
   * Yields heading cells for model info.
   *
   * @return {Generator<ReactElement>}
   * @see ORDER_STATES
   */
  *renderHeadings(): Generator<*, *, *> {
    const { sortData, onSortChange } = this.props;
    yield (
      <Cell
        tag="th"
        className="name"
        name="error"
        {...{ sortData, onSortChange }}
      >
        Error
      </Cell>
    );

    yield (
      <Cell tag="th">Severity</Cell>
    );

    yield (
      <Cell tag="th">Type</Cell>
    );

    yield (
      <Cell
        tag="th"
        name="description"
        {...{ sortData, onSortChange }}
      >
        Description
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        name="business_flag"
        {...{ sortData, onSortChange }}
      >
        Business
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        name="retry_flag"
        {...{ sortData, onSortChange }}
      >
        Retry
      </Cell>
    );

    yield (
      <Cell tag="th">Delay</Cell>
    );
  }

  /**
   * Yields cells with model data
   *
   * @param {Object} model
   * @param {String} selected
   * @return {Generator<ReactElement>}
   */
  *renderCells(model: Object): Generator<*, *, *> {
    yield (
      <Cell className="name nowrap">
        { model.error }
      </Cell>
    );

    yield (
      <Cell className="narrow text">{ model.severity }</Cell>
    );

    yield (
      <Cell className="narrow text">{ model.type }</Cell>
    );

    yield (
      <Cell className="desc nowrap">
        { model.description }
      </Cell>
    );

    yield (
      <Cell className="nowrap"><AutoComponent>{ model.business_flag }</AutoComponent></Cell>
    );

    yield (
      <Cell className="nowrap"><AutoComponent>{ model.retry_flag }</AutoComponent></Cell>
    );

    yield (
      <Cell className="nowrap">{ model.retry_delay_secs }</Cell>
    );
  }

  /**
   * Yields row for table head.
   *
   * @return {Generator<ReactElement>}
   * @see renderHeadings
   */
  *renderHeadingRow(): Generator<*, *, *> {
    yield (
      <Row cells={this._renderHeadings} />
    );
  }


  /**
   * Yields rows for table body.
   *
   * Row with active model is highlighted. Row are clickable and
   * trigger route change via {@link activateRow}.
   *
   * @param {number} activeId
   * @param {Array<Object>} collection
   * @return {Generator<ReactElement>}
   * @see activateRow
   * @see renderCells
   */
  *renderRows(collection: Array<Object>): Generator<*, *, *> {
    for (const model of collection) {
      yield (
        <Row
          key={model.error}
          data={ model }
          cells={this._renderCells}
        />
      );
    }
  }

  render() {
    return (
      <div className="tab-pane active">
        <Toolbar>
          <Search
            onSearchUpdate={this.props.onSearchChange}
            defaultValue={this.props.defaultSearchValue}
          />
        </Toolbar>
        <Table
          data={ this.props.collection }
          className="table table-condensed table-striped table--data"
        >
          <Section type="head" rows={this._renderHeadingRow} />
          <Section type="body" data={ this.props.collection } rows={this._renderRows} />
        </Table>
      </div>
    );
  }
}
