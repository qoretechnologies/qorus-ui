import React, { Component, PropTypes } from 'react';

import Table, { Section, Row, Cell } from 'components/table';
import ModalRun from './modal_run';

import { pureRender } from 'components/utils';
import goTo from 'routes';

import classNames from 'classnames';

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

    this._modal = null;
    this._commitFn = null;
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
   * @param {Object} err
   * @param {function(Object)} commitFn
   * @param {string} label
   * @param {?boolean} requireChanges
   */
  openModal(service, method, commmitFn, label, requireChanges) {
    this._commitFn = commmitFn;

    this._modal = (
      <ModalRun
        actionLabel={label}
        method={Object.assign({}, method)}
        service={service}
        onCommit={::this.submitModal}
        onCancel={::this.closeModal}
        requireChanges={requireChanges}
      />
    );

    this.context.openModal(this._modal);
  }


  /**
   * Submit changes from currently open modal dialog and closes it.
   *
   * It also calls commit function assigned to it with given error.
   *
   * @param {Object} err
   * @see closeModal
   */
  submitModal(err) {
    this._commitFn(err);
    this.closeModal();
  }


  /**
   * Closes currently open modal dialog.
   */
  closeModal() {
    this.context.closeModal(this._modal);
    this._modal = null;
    this._commitFn = null;
  }
  /**
   * Yields heading cells for model info.
   *
   * @return {Generator<ReactElement>}
   * @see ORDER_STATES
   */
  *renderHeadings() {
    yield (
      <Cell tag="th" className="name">Name</Cell>
    );

    yield (
      <Cell tag="th" className="narrow">
        <i className="fa fa-lock" />
      </Cell>
    );

    yield (
      <Cell tag="th" className="narrow">
        <i className="fa fa-cog" />
      </Cell>
    );

    yield (
      <Cell tag="th" className="narrow">
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
        {(model.lock !== 'none') && <i className="fa fa-ok text-success" />}
        {!(model.lock === 'none') && <i className="fa fa-minus-circle text-danger" />}
      </Cell>
    );

    yield (
      <Cell tag="td" className="narrow">
        {model.internal && <i className="fa fa-ok text-success" />}
        {!model.internal && <i className="fa fa-minus-circle text-danger" />}
      </Cell>
    );

    yield (
      <Cell tag="td" className="narrow">
        {model.write && <i className="fa fa-ok text-success" />}
        {!model.write && <i className="fa fa-minus-circle text-danger" />}
      </Cell>
    );

    const service = this.props.service;
    const runCode = this.openModal.bind(this, service, model, ::this.closeModal, 'Run', false);

    yield (
      <Cell tag="td">
        <div className="btn-group">
          <button
            className="btn btn-xs btn-success"
            onClick={runCode}
          >
            <i className="fa fa-play" />
          </button>
          <button className="btn btn-xs btn-inverse">
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
      <Row cells={::this.renderHeadings} />
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
          key={model.id}
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
          collection: this.props.service.methods.sort(::this.compare),
        }}
        sections={this._renderSections}
        className={'table table-striped table-condensed table-hover ' +
                   'table-fixed table--data'}
      />
    );
  }
}
