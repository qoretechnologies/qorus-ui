import React, { Component, PropTypes } from 'react';

import Table, { Section, Row, Cell } from '../../components/table';
import ServiceControls from './controls';
import Checkbox from '../../components/checkbox';

import { pureRender } from 'components/utils';
import { goTo } from '../../helpers/router';

import classNames from 'classnames';

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
    initialFilter: PropTypes.func,
    onDataFilterChange: PropTypes.func,
    setSelectedData: PropTypes.func,
    selectedData: PropTypes.object,
    onSortChange: PropTypes.func,
    sortData: PropTypes.object,
  };


  static contextTypes = {
    router: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
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

  componentWillReceiveProps(next) {
    if (this.props.initialFilter !== next.initialFilter) {
      this.setupFilters(next);
    }
  }

  /**
   * Sets the initial selected workflows based on the
   * filter function received in props
   *
   * @param {Object} props
   */
  setupFilters(props) {
    const selectedData = props.initialFilter ?
      props.collection.reduce((sel, s) => (
        Object.assign(sel, { [s.id]: props.initialFilter(s, this.props.selectedData) })
      ), {}) :
    {};

    this.setSelectedServices(selectedData);
  }

  /**
   * Sends the selected workflows one level up to
   * the workflows component and sets the state
   *
   * @param {Object} selectedData
   */
  setSelectedServices(selectedData) {
    if (this.props.collection.every(s => selectedData[s.id])) {
      this.props.onDataFilterChange('all');
    } else if (this.props.collection.some(s => selectedData[s.id])) {
      this.props.onDataFilterChange('some');
    } else {
      this.props.onDataFilterChange('none');
    }

    this.props.setSelectedData(selectedData);
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
    if (ev.defaultPrevented) return;

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
      change,
      this.context.location.query
    );
  }

  /**
   * Handles the individual workflow checkboxes
   *
   * @param {Event} ev
   */
  handleCheckboxClick = (ev) => {
    const service = this.findActivatedRow(ev.currentTarget.parentElement.parentElement);
    const selectedData = Object.assign({},
      this.props.selectedData,
      { [service.id]: !this.props.selectedData[service.id] }
    );

    this.setSelectedServices(selectedData);
  };

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
      <Cell
        tag="th"
        className="narrow"
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
        name="type"
      >
        Type
      </Cell>
    );

    yield (
      <Cell tag="th" className="narrow">Actions</Cell>
    );

    yield (
      <Cell
        tag="th"
        className="narrow"
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
        name="threads"
      >
        Threads
      </Cell>
    );

    yield (
      <Cell tag="th" className="narrow">
        <i className="fa fa-warning" />
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        className="name"
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
        name="name"
      >
        Name
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        className="narrow"
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
        name="version"
      >
        Version
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        className="desc"
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
        name="description"
      >
        Description
      </Cell>
    );
  }


  /**
   * Yields cells with model data
   *
   * @param {Object} model
   * @param {bool} selected
   * @return {Generator<ReactElement>}
   */
  *renderCells({ model, selected }) {
    const typeIcon = (model.type === 'system') ?
      classNames('fa', 'fa-cog') : classNames('fa', 'fa-user');

    const alert = model.has_alerts ?
      <i className="fa fa-warning text-danger" /> : '';


    yield (
      <Cell className="narrow">
        <Checkbox
          action={this.handleCheckboxClick}
          checked={selected ? 'CHECKED' : 'UNCHECKED'}
        />
      </Cell>
    );

    yield (
      <Cell className="narrow">
        <i className={ typeIcon } />
      </Cell>
    );

    yield (
      <Cell className="narrow">
        <ServiceControls service={ model } />
      </Cell>
    );

    yield (
      <Cell className="narrow">{model.threads}</Cell>
    );

    yield (
      <Cell className="narrow">{ alert }</Cell>
    );

    yield (
      <Cell className="name">{model.name}</Cell>
    );

    yield (
      <Cell className="narrow">{model.version}</Cell>
    );

    yield (
      <Cell className="desc">{model.desc}</Cell>
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
   * @param {Array<Object>} selectedData
   * @return {Generator<ReactElement>}
   * @see activateRow
   * @see renderCells
   */
  *renderRows({ activeId, collection, selectedData }) {
    for (const model of collection) {
      yield (
        <Row
          key={model.id}
          data={{
            model,
            selected: selectedData[model.serviceid],
          }}
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
          selectedData: this.props.selectedData,
        }}
        sections={this._renderSections}
        className={'table table-striped table-condensed table-hover ' +
                   'table-fixed table--data'}
      />
    );
  }
}
