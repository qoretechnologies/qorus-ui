import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Table, { Section, Row, Cell } from 'components/table';
import Loader from 'components/loader';
import Shorten from 'components/shorten';
import AutoComponent from 'components/autocomponent';

// import Error from '../../../../../types/error/react';

import actions from 'store/api/actions';

const errorsMetaSelector = (state) => {
  if (state.api.errors.global) {
    return {
      sync: state.api.errors.global.sync,
      loading: state.api.errors.global.loading,
    };
  }

  return { sync: false, loading: false };
};

const errorsSelector = (state) => {
  if (state.api.errors.global) {
    let col = [];

    Object.keys(state.api.errors.global.data)
      .forEach((key) => col.push(state.api.errors.global.data[key]));

    return col;
  }
  return [];
};

const viewSelector = createSelector(
  [
    errorsSelector,
    errorsMetaSelector,
  ],
  (errors, meta) => ({
    collection: errors,
    sync: meta.sync,
    loading: meta.loading,
  })
);

@connect(viewSelector)
export default class Errors extends Component {
  static propTypes = {
    sync: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    collection: PropTypes.array.isRequired,
    dispatch: PropTypes.func,
  }

  componentWillMount() {
    this.props.dispatch(actions.errors.fetch('global'));

    this._renderHeadingRow = ::this.renderHeadingRow;
    this._renderRows = ::this.renderRows;
    this._renderCells = ::this.renderCells;
    this._renderHeadings = ::this.renderHeadings;
  }

  /**
   * Yields heading cells for model info.
   *
   * @return {Generator<ReactElement>}
   * @see ORDER_STATES
   */
  *renderHeadings() {
    yield (
      <Cell tag="th" className="name">
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
      <Cell tag="th">Description</Cell>
    );

    yield (
      <Cell tag="th">Business</Cell>
    );

    yield (
      <Cell tag="th">Retry</Cell>
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
  *renderCells(model) {
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
  *renderHeadingRow() {
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
  *renderRows(collection) {
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
    if (!this.props.sync || this.props.loading) {
      return <Loader />;
    }

    return (
      <Table data={ this.props.collection } className="table table-condensed table-striped table--data">
        <Section type="head" rows={this._renderHeadingRow} />
        <Section type="body" data={ this.props.collection } rows={this._renderRows} />
      </Table>
    );
  }
}
