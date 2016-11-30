import React, { Component, PropTypes } from 'react';

import Table, { Section, Row, Cell } from 'components/table';
import ModalRun from './modal_run';
import ModalCode from './modal_code';

import { pureRender } from 'components/utils';

/**
 * List of all workflows in the system.
 *
 * Beware, this component is very performance internsive - even
 * HTML/CSS without any JS is relatively slow.
 */
@pureRender
export default class MethodsTable extends Component {
  static propTypes = {
    service: PropTypes.object,
  };


  static contextTypes = {
    openModal: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
  };


  /**
   * Bounds generators and event handlers to `this` instance.
   *
   * This improves render performance as generators and event handlers
   * are used as cache key by pure render.
   */
  componentWillMount() {
    this._renderSections = ::this.renderSections;
    this._renderHeadingRow = ::this.renderHeadingRow;
    this._renderRows = ::this.renderRows;
    this._renderCells = ::this.renderCells;
    this.renderHeadings = ::this.renderHeadings;
  }

  /**
   * Returns sorted collection
   *
   * @return <Array>
   */
  getCollection() {
    return this.props.service.methods.sort(this.compare);
  }

  /**
   * Sorts collection by name attribute
   */
  compare(a, b) {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return +1;
    return 0;
  }

  /**
   * Opens modal dialog to manage particular error.
   *
   * @param {string} modal type
   * @param {Object} service
   * @param {Object} method
   */
  openModal = (modal, service, method) => {
    if (modal === 'run') {
      this._modal = (
        <ModalRun
          method={Object.assign({}, method)}
          service={service}
          onClose={this.closeModal}
        />
      );
    } else {
      this._modal = (
        <ModalCode
          method={Object.assign({}, method)}
          service={service}
          onClose={this.closeModal}
        />
      );
    }


    this.context.openModal(this._modal);
  }

  /**
   * Closes currently open modal dialog.
   */
  closeModal = () => {
    this.context.closeModal(this._modal);
    this._modal = null;
  }

  /**
   * Opens modal window
   */
  handleClick = (modal, method) => () => {
    this.openModal(modal, this.props.service, method);
  }

  /**
   * Fixes binding and syntax error when generator is followed
   * by generator
   */
  fixit() {}

  /**
   * Yields heading cells for model info.
   *
   * @return {Generator<ReactElement>}
   */
  *renderHeadings() {
    yield (
      <Cell tag="th" className="name">Name</Cell>
    );

    yield (
      <Cell tag="th" className="narrow" title="Locktype">
        <i className="fa fa-lock" />
      </Cell>
    );

    yield (
      <Cell tag="th" className="narrow" title="System">
        <i className="fa fa-cog" />
      </Cell>
    );

    yield (
      <Cell tag="th" className="narrow" title="Write">
        <i className="fa fa-pencil" />
      </Cell>
    );

    yield (
      <Cell tag="th" />
    );
  }


  /**
   * Yields cells with model data
   *
   * @param {Object} model
   * @return {Generator<ReactElement>}
   */
  *renderCells(model) {
    yield (
      <Cell tag="td" className="name">{model.name}</Cell>
    );

    yield (
      <Cell tag="td" className="narrow">
        {(model.locktype !== 'none') && <i className="fa fa-check-circle text-success" />}
        {(model.locktype === 'none') && <i className="fa fa-minus-circle text-danger" />}
      </Cell>
    );

    yield (
      <Cell tag="td" className="narrow">
        {model.internal && <i className="fa fa-check-circle text-success" />}
        {!model.internal && <i className="fa fa-minus-circle text-danger" />}
      </Cell>
    );

    yield (
      <Cell tag="td" className="narrow">
        {model.write && <i className="fa fa-check-circle text-success" />}
        {!model.write && <i className="fa fa-minus-circle text-danger" />}
      </Cell>
    );

    yield (
      <Cell tag="td">
        <div className="btn-group">
          <button
            className="btn btn-xs btn-success"
            onClick={this.handleClick('run', model)}
            title="Run method"
          >
            <i className="fa fa-play" />
          </button>
          <button
            className="btn btn-xs btn-inverse"
            onClick={this.handleClick('code', model)}
            title="Show code"
          >
            <i className="fa fa-code" />
          </button>
        </div>
      </Cell>
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
      <Row cells={this.renderHeadings} />
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
  *renderRows({ collection }) {
    for (const model of collection) {
      yield (
        <Row
          key={model.name}
          data={model}
          cells={this._renderCells}
        />
      );
    }
  }


  /**
   * Yields table sections.
   *
   * @return {Generator<ReactElement>}
   * @see renderHeadingRow
   * @see renderRows
   */
  *renderSections(data) {
    yield (
      <Section type="head" rows={this._renderHeadingRow} />
    );

    yield (
      <Section type="body" data={data} rows={this._renderRows} />
    );
  }


  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    return (
      <Table
        data={{
          collection: this.getCollection(),
        }}
        sections={this._renderSections}
        className={'table table-striped table-condensed table-hover ' +
                   'table-fixed table--data'}
      />
    );
  }
}
