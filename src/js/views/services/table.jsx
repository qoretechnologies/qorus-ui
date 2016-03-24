import React, { Component, PropTypes } from 'react';


import Table, { Section, Row, Cell } from 'components/table';
import Badge from 'components/badge';

import { pureRender } from 'components/utils';
import goTo from 'routes';


import classNames from 'classnames';
import actions from 'store/api/actions';


/**
 * List of all workflows in the system.
 *
 * Beware, this component is very performance internsive - even
 * HTML/CSS without any JS is relatively slow.
 */
@pureRender
export default class ServicesTable extends Component {
  static propTypes = {
    collection: PropTypes.array,
    activeRowId: PropTypes.number,
  };


  static contextTypes = {
    router: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };


  /**
   * Bounds generators and event handlers to `this` instance.
   *
   * This improves render performance as generators and event handlers
   * are used as cache key by pure render.
   */
  componentWillMount() {
    this._activateRow = ::this.activateRow;

    this._renderSections = ::this.renderSections;
    this._renderHeadingRow = ::this.renderHeadingRow;
    this._renderRows = ::this.renderRows;
    this._renderCells = ::this.renderCells;
  }

  /**
   * Finds workflow associated with given row element.
   *
   * @param {HTMLTableRowElement} row
   * @return {Object}
   */
  findActivatedRow(row) {
    let idx = null;
    for (let i = 0; i < row.parentElement.rows.length; i += 1) {
      if (row === row.parentElement.rows[i]) {
        idx = i;
        break;
      }
    }

    return this.props.collection[idx] || null;
  }


  /**
   * Changes active route to workflow associated with clicked element.
   *
   * If the event handled some significant action before (i.e., its
   * default action is prevented), it does nothing.
   *
   * @param {Event} ev
   */
  activateRow(ev) {
    if (ev.isDefaultPrevented()) return;

    const model = this.findActivatedRow(ev.currentTarget);
    const shouldDeactivate =
      this.context.params.detailId &&
      parseInt(this.context.params.detailId, 10) === model.id;
    const change = {
      detailId: shouldDeactivate ? null : model.id,
      tabId: shouldDeactivate ? null : this.context.params.tabId,
    };

    goTo(
      this.context.router,
      'services',
      this.context.route.path,
      this.context.params,
      change
    );
  }


  /**
   * Yields heading cells for model info.
   *
   * @return {Generator<ReactElement>}
   * @see ORDER_STATES
   */
  *renderHeadings() {
    yield (
      <Cell tag="th" className="narrow" />
    );

    yield (
      <Cell tag="th" className="narrow">Type</Cell>
    );

    yield (
      <Cell tag="th" className="narrow">Threads</Cell>
    );

    yield (
      <Cell tag="th" className="narrow">
        <i className="fa fa-warning-sign" />
      </Cell>
    );

    yield (
      <Cell tag="th" className="name">Name</Cell>
    );

    yield (
      <Cell tag="th" className="narrow">Version</Cell>
    );

    yield (
      <Cell tag="th" className="description">Description</Cell>
    );
  }


  /**
   * Yields cells with model data
   *
   * @param {Object} model
   * @return {Generator<ReactElement>}
   */
  *renderCells(model) {
    const typeIcon = (model.type === 'system') ?
      classNames('fa', 'fa-cog') : classNames('fa', 'fa-user');

    yield (
      <Cell className="narrow">
        <i className="fa fa-square-o" />
      </Cell>
    );


    yield (
      <Cell className="narrow">
        <i className={ typeIcon } />
      </Cell>
    );

    yield (
      <Cell className="narrow">{model.threads}</Cell>
    );

    yield (
      <Cell className="narrow">{model.has_alerts}</Cell>
    );

    yield (
      <Cell className="name">{model.name}</Cell>
    );

    yield (
      <Cell className="narrow">{model.version}</Cell>
    );

    yield (
      <Cell className="description">{model.desc}</Cell>
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
  *renderRows({ activeId, collection }) {
    for (const model of collection) {
      yield (
        <Row
          key={model.id}
          data={model}
          cells={this._renderCells}
          onClick={this._activateRow}
          className={classNames({
            info: model.id === activeId,
          })}
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
          activeId: this.props.activeRowId,
          collection: this.props.collection,
        }}
        sections={this._renderSections}
        className={'table table-striped table-condensed table-hover ' +
                   'table-fixed table--data'}
      />
    );
  }
}
