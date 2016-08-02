import React, { Component, PropTypes } from 'react';

// utils
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import classNames from 'classnames';
import { flowRight } from 'lodash';

import Table, { Cell, Section, Row } from '../../../components/table';
import Date from '../../../components/date';
import Loader from '../../../components/loader';
import Shorten from '../../../components/shorten';

import { sortTable } from '../../../helpers/table';

import Alerts from '../../../../../types/alerts/react';

import actions from 'store/api/actions';
import * as ui from 'store/ui/actions';
import { browserHistory } from 'react-router';

const alertsSelector = state => state.api.alerts;
const typeSelector = (state, props) => props.params.type;
const sortSelector = state => state.ui.alerts;

const activeRowId = (state, props) => parseFloat(props.params.id, 10);

const filterCollection = type => collection => (
  collection.filter(c => c.alerttype.toLowerCase() === type)
);

const sortCollection = sortData => collection => (
  sortTable(collection, sortData)
);

const collectionSelector = createSelector(
  [
    alertsSelector,
    typeSelector,
    sortSelector,
  ], (alerts, type, sortData) => flowRight(
    sortCollection(sortData),
    filterCollection(type)
  )(alerts.data)
);

const viewSelector = createSelector(
  [
    alertsSelector,
    collectionSelector,
    activeRowId,
    sortSelector,
  ],
  (meta, collection, rowId, sortData) => ({
    loading: meta.loading,
    sync: meta.sync,
    collection,
    activeRowId: rowId,
    sortData,
  })
);

@connect(viewSelector)
export default class AlertsTable extends Component {
  static propTypes = {
    collection: PropTypes.arrayOf(Alerts),
    activeRowId: PropTypes.number,
    dispatch: PropTypes.func,
    sync: PropTypes.bool,
    loading: PropTypes.bool,
    route: PropTypes.object,
    children: PropTypes.node,
    location: PropTypes.object,
    sortData: PropTypes.object,
  };

  static defaultProps = {
    activeRowId: null,
  };

  static childContextTypes = {
    dispatch: PropTypes.func,
    route: PropTypes.object,
  };

  getChildContext() {
    return {
      dispatch: this.props.dispatch,
      route: this.props.route,
    };
  }

  componentWillMount() {
    this.props.dispatch(actions.alerts.fetch());

    this._renderHeadingRow = ::this.renderHeadingRow;
    this._renderRows = ::this.renderRows;
    this._renderCells = ::this.renderCells;
  }

  activateRow = (modelId) => (ev) => {
    if (ev.defaultPrevented) return;

    const shouldDeactivate = modelId === this.props.activeRowId;

    const urlChunks = this.props.location.pathname.split('/');
    const url = urlChunks.length === 5 ? urlChunks.slice(0, 4).join('/') : urlChunks.join('/');

    if (shouldDeactivate) {
      browserHistory.push(url);
    } else {
      browserHistory.push(`${url}/${modelId}`);
    }
  };

  handleSortChange = (sortChange) => {
    this.props.dispatch(
      ui.alerts.sort(sortChange)
    );
  };

  /**
   * Yields heading cells for model info.
   *
   * @return {Generator<ReactElement>}
   * @see ORDER_STATES
   */
  *renderHeadings() {
    yield (
      <Cell
        tag="th"
        className="narrow"
      />
    );

    yield (
      <Cell
        tag="th"
        name="type"
        sortData={this.props.sortData}
        onSortChange={this.handleSortChange}
      >
        Type
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        name="alert"
        sortData={this.props.sortData}
        onSortChange={this.handleSortChange}
      >
        Alert
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        name="object"
        sortData={this.props.sortData}
        onSortChange={this.handleSortChange}
      >
        Object
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        name="when"
        sortData={this.props.sortData}
        onSortChange={this.handleSortChange}
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

    yield (
      <Cell className="name nowrap">{ model.type }</Cell>
    );

    yield (
      <Cell className="name nowrap">{ model.alert }</Cell>
    );

    yield (
      <Cell className="desc">
        <Shorten extraClassname="text-left">
          {model.version && `${model.name} v${model.version} ${model.id}` }
          {!model.version && `${model.name}` }
        </Shorten>
      </Cell>
    );

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
          key={model.alertid}
          data={{ model }}
          cells={this._renderCells}
          onClick={this.activateRow(model.alertid)}
          className={classNames({
            info: model.alertid === parseInt(activeId, 10),
          })}
        />
      );
    }
  }

  render() {
    if (!this.props.sync || this.props.loading) {
      return (
        <div className="tab-pane active">
          <Loader />
        </div>
      );
    }

    if (this.props.collection.length === 0) {
      return (
        <div className="tab-pane active">
          <p>No alerts found</p>
        </div>
      );
    }

    const data = {
      activeId: this.props.activeRowId,
      collection: this.props.collection,
    };

    return (
      <div className="tab-pane active">
        <Table
          data={ data }
          className="table table-condensed table-fixed table-striped table--data"
        >
          <Section type="head" rows={this._renderHeadingRow} />
          <Section type="body" data={ data } rows={this._renderRows} />
        </Table>
        { this.props.children }
      </div>
    );
  }
}
