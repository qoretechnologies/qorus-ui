import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import classNames from 'classnames';
import { flowRight } from 'lodash';
import { Link } from 'react-router';
import compose from 'recompose/compose';

import Table, { Cell, Section, Row } from '../../../components/table';
import { Control as Button } from '../../../components/controls';
import Date from '../../../components/date';
import Shorten from '../../../components/shorten';
import sort from '../../../hocomponents/sort';
import sync from '../../../hocomponents/sync';
import withPane from '../../../hocomponents/pane';
import actions from '../../../store/api/actions';
import { sortDefaults } from '../../../constants/sort';
import { getAlertObjectLink } from '../../../helpers/system';
import { findBy } from '../../../helpers/search';
import { propSelector } from '../../../selectors';
import Pane from './pane';
import withSearch from '../../../hocomponents/search';
import Search from '../../../components/search';
import Toolbar from '../../../components/toolbar';

const alertsSelector = state => state.api.alerts;
const typeSelector = (state, props) => props.params.type;

const activeRowId = (state, props) => parseFloat(props.params.id, 10);

const filterCollection = type => collection => (
  collection.filter(c => c.alerttype.toLowerCase() === type)
);

const searchCollection: Function = (
  query: string
): Function => (
  collection: Array<Object>
): Array<Object> => (
  findBy(['alerttype', 'alert', 'name'], query, collection)
);

const collectionSelector = createSelector(
  [
    alertsSelector,
    typeSelector,
    propSelector('query'),
  ], (alerts, type, query) => flowRight(
    filterCollection(type),
    searchCollection(query)
  )(alerts.data)
);

const viewSelector = createSelector(
  [
    alertsSelector,
    collectionSelector,
    activeRowId,
  ],
  (meta, collection, rowId) => ({
    meta,
    collection,
    activeRowId: rowId,
  })
);

@compose(
  withSearch('alertQuery'),
  connect(
    viewSelector,
    {
      load: actions.alerts.fetch,
      updateDone: actions.alerts.updateDone,
    }
  ),
  sort(
    'alert',
    'collection',
    sortDefaults.alerts
  ),
  sync('meta'),
  withPane(Pane)
)
export default class AlertsTable extends Component {
  static propTypes = {
    collection: PropTypes.array,
    activeRowId: PropTypes.number,
    sync: PropTypes.bool,
    loading: PropTypes.bool,
    route: PropTypes.object,
    children: PropTypes.node,
    location: PropTypes.object,
    sortData: PropTypes.object,
    onSortChange: PropTypes.func,
    updateDone: PropTypes.func,
    openPane: PropTypes.func,
    onSearchChange: PropTypes.func,
    defaultSearchValue: PropTypes.string,
    paneId: PropTypes.string,
    query: PropTypes.string,
  };

  componentWillMount() {
    this._renderHeadingRow = ::this.renderHeadingRow;
    this._renderRows = ::this.renderRows;
    this._renderCells = ::this.renderCells;
  }

  handleHighlightEnd = (id) => () => {
    this.props.updateDone(id);
  };

  /**
   * Yields heading cells for model info.
   *
   * @return {Generator<ReactElement>}
   * @see ORDER_STATES
   */
  *renderHeadings() {
    const { sortData, onSortChange } = this.props;
    yield (
      <Cell
        tag="th"
        className="narrow"
      />
    );

    yield (
      <Cell
        tag="th"
        className="narrow"
      > - </Cell>
    );

    yield (
      <Cell
        tag="th"
        name="type"
        sortData={sortData}
        onSortChange={onSortChange}
      >
        Type
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        name="alert"
        sortData={sortData}
        onSortChange={onSortChange}
      >
        Alert
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        name="object"
      >
        Object
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        name="when"
        sortData={sortData}
        onSortChange={onSortChange}
      >
        When
      </Cell>
    );
  }

  *renderCells({ model }) {
    yield (
      <Cell className="narrow">
        <i className="text-danger fa fa-exclamation-triangle" />
      </Cell>
    );

    const handleDetailClick = () => {
      this.props.openPane(`${model.type}:${model.id}`);
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
      <Cell className="name nowrap">{ model.type }</Cell>
    );

    yield (
      <Cell className="name nowrap">{ model.alert }</Cell>
    );

    const name = model.version ?
      `${model.name} v${model.version} (${model.id})` :
      `${model.name} (${model.id})`;

    if (model.type === 'RBAC' || (model.type === 'GROUP' && model.id < 0)) {
      yield (
        <Cell className="desc">
          { name }
        </Cell>
      );
    } else {
      yield (
        <Cell className="desc">
          <Link to={getAlertObjectLink(model.type, model)}>
            { name }
          </Link>
        </Cell>
      );
    }

    yield (
      <Cell className="nowrap"><Date date={ model.when } /></Cell>
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
   * @param {Array<Object>} collection
   * @return {Generator<ReactElement>}
   * @see activateRow
   * @see renderCells
   */
  *renderRows({ collection }) {
    for (const model of collection) {
      yield (
        <Row
          key={model.alertid}
          data={{ model }}
          cells={this._renderCells}
          highlight={model._updated}
          onHighlightEnd={this.handleHighlightEnd(model.alertid)}
          className={classNames({
            info: model.alertid === parseInt(this.props.paneId, 10),
          })}
        />
      );
    }
  }

  renderTable() {
    if (!this.props.collection.length) {
      return (
        <div className="tab-pane active">
          <p> No data </p>
        </div>
      );
    }

    const data = {
      collection: this.props.collection,
    };

    return (
      <Table
        data={ data }
        className="table table-condensed table-fixed table-striped table--data"
      >
        <Section type="head" rows={this._renderHeadingRow} />
        <Section type="body" data={ data } rows={this._renderRows} />
      </Table>
    );
  }

  render() {
    return (
      <div>
        <Toolbar>
          <Search
            onSearchUpdate={this.props.onSearchChange}
            defaultValue={this.props.query}
          />
        </Toolbar>
        { this.renderTable() }
        { this.props.children }
      </div>
    );
  }
}
