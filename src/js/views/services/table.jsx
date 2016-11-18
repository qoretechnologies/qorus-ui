import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import Table, { Section, Row, Cell } from '../../components/table';
import { Controls, Control as Button } from '../../components/controls';
import ServiceControls from './controls';
import Checkbox from '../../components/checkbox';

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
    onDetailClick: PropTypes.func,
    onUpdateDone: PropTypes.func,
  };

  static contextTypes = {
    router: PropTypes.object,
    route: PropTypes.object,
    params: PropTypes.object,
    dispatch: PropTypes.func,
    location: PropTypes.object,
    openModal: PropTypes.func,
    closeModal: PropTypes.func,
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

  handleHighlightEnd = (id) => () => {
    this.props.onUpdateDone(id);
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
      <Cell tag="th" className="narrow">-</Cell>
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
        name="desc"
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

    const handleCheckboxClick = () => {
      const selectedData = Object.assign({},
        this.props.selectedData,
        { [model.id]: !this.props.selectedData[model.id] }
      );

      this.setSelectedServices(selectedData);
    };

    yield (
      <Cell className="narrow checker">
        <Checkbox
          action={handleCheckboxClick}
          checked={selected ? 'CHECKED' : 'UNCHECKED'}
        />
      </Cell>
    );

    const handleDetailClick = () => {
      this.props.onDetailClick(model.id);
    };

    yield (
      <Cell className="narrow">
        <Button
          label="Detail"
          btnStyle="success"
          onClick={handleDetailClick}
        />
      </Cell>
    );

    yield (
      <Cell className="narrow">
        <i className={ typeIcon } />
      </Cell>
    );

    const {
      status,
      enabled,
      autostart,
    } = model;

    yield (
      <Cell className="narrow">
        <ServiceControls
          status={status}
          enabled={enabled}
          autostart={autostart}
          service={model}
        />
      </Cell>
    );

    yield (
      <Cell className="narrow">{model.threads}</Cell>
    );

    const handleAlertClick = () => {
      this.props.onDetailClick(model.id, 'alerts');
    };

    yield (
      <Cell className="narrow">
        {model.has_alerts && (
          <Controls>
            <Button
              icon="warning"
              btnStyle="danger"
              onClick={handleAlertClick}
            />
          </Controls>
        )}
      </Cell>
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
            selected: selectedData[model.id],
          }}
          cells={this._renderCells}
          highlight={model._updated}
          onHighlightEnd={this.handleHighlightEnd(model.id)}
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
