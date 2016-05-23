import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import actions from 'store/api/actions';

import StatusIcon from '../../../components/status_icon';
import Loader from '../../../components/loader';
import Table, { Section, Row, Cell } from '../../../components/table';


const viewSelector = createSelector(
  [
    state => state.api.systemOptions,
  ],
  (options) => ({
    collection: options,
  })
);

@connect(viewSelector)
export default class Options extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    collection: PropTypes.object.isRequired,
  }

  componentWillMount() {
    this.props.dispatch(actions.systemOptions.fetch());

    this.renderCells = ::this.renderCells;
    this.renderRows = ::this.renderRows;
    this.renderSections = ::this.renderSections;
  }

  /**
   * Yields cells with model data.
   *
   * @param {Object} error
   * @return {Generator<ReactElement>}
   */
  *renderCells(model) {
    yield (
      <Cell>
        <i className="fa fa-lock" />
      </Cell>
    );

    yield (
      <Cell className="name">{model.name}</Cell>
    );

    yield (
      <Cell className="desc"><div className="shorten">{model.desc}</div></Cell>
    );

    yield (
      <Cell>{JSON.stringify(model.default)}</Cell>
    );

    yield (
      <Cell>{JSON.stringify(model.expects)}</Cell>
    );

    yield (
      <Cell>{JSON.stringify(model.interval)}</Cell>
    );

    yield (
      <Cell><StatusIcon value={ model.job } /></Cell>
    );

    yield (
      <Cell><StatusIcon value={ model.service } /></Cell>
    );

    yield (
      <Cell><StatusIcon value={ model.workflow } /></Cell>
    );

    yield (
      <Cell>{JSON.stringify(model.value)}</Cell>
    );
  }


  /**
   * Yields rows for table body.
   *
   * @param {Array<Object>} collection
   * @return {Generator<ReactElement>}
   * @see renderCells
   */
  *renderRows(collection) {
    for (const model of collection) {
      yield (
        <Row key={model.name} data={model} cells={this.renderCells} />
      );
    }
  }

  /**
   * Yields table sections.
   *
   * @param {Array<Object>} options
   * @return {Generator<ReactElement>}
   * @see renderRows
   */
  *renderSections(collection) {
    yield (
      <thead>
        <tr>
          <th>Status</th>
          <th className="name">Name</th>
          <th>Description</th>
          <th>Default</th>
          <th>Expects</th>
          <th>Interval</th>
          <th>Job</th>
          <th>Service</th>
          <th>Workflow</th>
          <th>Value</th>
        </tr>
      </thead>
    );

    yield (
      <Section type="body" data={collection} rows={this.renderRows} />
    );
  }

  render() {
    const { collection } = this.props;

    if (!collection.sync || collection.loading) {
      return <Loader />;
    }

    return (
      <div className="container-fluid">
        <Table
          data={ collection.data }
          className="tabel table-striped table-condensed table--data"
          sections={this.renderSections}
        />
      </div>
    );
  }
}
