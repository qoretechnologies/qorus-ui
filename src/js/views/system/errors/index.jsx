/* @flow */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';

import Table, { Section, Row, Cell } from '../../../components/table';
import Shorten from '../../../components/shorten';
import AutoComponent from '../../../components/autocomponent';
import patch from '../../../hocomponents/patchFuncArgs';
import sort from '../../../hocomponents/sort';
import sync from '../../../hocomponents/sync';
import apiActions from '../../../store/api/actions';

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

const viewSelector = createSelector(
  [
    errorsSelector,
    errorsMetaSelector,
  ],
  (collection: Array<Object>, meta: Object): Object => ({ meta, collection })
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
    {
      sortBy: 'error',
      sortByKey: {
        direction: -1,
        ignoreCase: true,
      },
      historySortBy: 'description',
      historySortByKey: {
        direction: 1,
        ignoreCase: true,
      },
    }
  ),
  sync('meta')
)
export default class Errors extends Component {
  static propTypes = {
    collection: PropTypes.array.isRequired,
    sortData: PropTypes.object,
    handleSortChange: PropTypes.func,
  };

  props: {
    collection: Array<Object>,
    sortData: Object,
    handleSortChange: Function,
  }

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
    const { sortData, handleSortChange } = this.props;
    yield (
      <Cell
        tag="th"
        className="name"
        name="error"
        {...{ sortData, onSortChange: handleSortChange }}
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
        {...{ sortData, onSortChange: handleSortChange }}
      >
        Description
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        name="business_flag"
        {...{ sortData, onSortChange: handleSortChange }}
      >
        Business
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        name="retry_flag"
        {...{ sortData, onSortChange: handleSortChange }}
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
      <Cell className="narrow">{ model.severity }</Cell>
    );

    yield (
      <Cell className="narrow">{ model.type }</Cell>
    );

    yield (
      <Cell className="desc nowrap">
        <Shorten extraClassname="text-left">
          { model.description }
        </Shorten>
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
      <Table
        data={ this.props.collection }
        className="table table-condensed table-striped table--data"
      >
        <Section type="head" rows={this._renderHeadingRow} />
        <Section type="body" data={ this.props.collection } rows={this._renderRows} />
      </Table>
    );
  }
}
