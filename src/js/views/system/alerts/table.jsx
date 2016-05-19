import React, { Component, PropTypes } from 'react';

// utils
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import classNames from 'classnames';
// import { setTitle } from '../../helpers/document';
// import firstBy from 'thenby';

import Table, { Cell, Section, Row } from '../../../components/table';
import Date from '../../../components/date';
import Loader from '../../../components/loader';

import Alerts from '../../../../../types/alerts/react';

import actions from 'store/api/actions';
import { browserHistory } from 'react-router';

const alertsMetaSelector = (state) => ({
  sync: state.api.alerts.sync,
  loading: state.api.alerts.loading,
});

const alertsSelector = (state, props) => (
  state.api.alerts.data.filter(a => (a.alerttype.toLowerCase() === props.route.path.toLowerCase()))
);

const viewSelector = createSelector(
  [
    alertsSelector,
    alertsMetaSelector,
  ],
  (alerts, meta) => ({
    collection: alerts,
    sync: meta.sync,
    loading: meta.loading,
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
  }

  static defaultProps = {
    activeRowId: null,
  }

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
    this._activateRow = ::this.activateRow;
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

    const type = this.props.route.path;

    if (shouldDeactivate) {
      browserHistory.push(`/system/dashboard/${type}/`);
    } else {
      browserHistory.push(`/system/dashboard/${type}/${model.id}`);
    }
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
      <Cell tag="th">Type</Cell>
    );

    yield (
      <Cell tag="th">Alert</Cell>
    );

    yield (
      <Cell tag="th">Object</Cell>
    );

    yield (
      <Cell tag="th">When</Cell>
    );
  }

  /**
   * Yields cells with model data
   *
   * @param {Object} model
   * @param {String} selected
   * @return {Generator<ReactElement>}
   */
  *renderCells({ model }) {
    yield (
      <Cell className="narrow">
        <i className="text-danger fa fa-exclamation-triangle" />
      </Cell>
    );

    yield (
      <Cell className="name">{ model.type }</Cell>
    );

    yield (
      <Cell className="name">{ model.alert }</Cell>
    );

    yield (
      <Cell>{ model.object }</Cell>
    );

    yield (
      <Cell><Date date={ model.when } /></Cell>
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
          onClick={this._activateRow}
          className={classNames({
            info: model.alertid === activeId,
          })}
        />
      );
    }
  }

  render() {
    if (!this.props.sync || this.props.loading) {
      return <Loader />;
    }

    if (this.props.collection.length === 0) {
      return <p>No alerts found</p>;
    }

    const data = {
      activeId: this.props.activeRowId,
      collection: this.props.collection,
    };

    return (
      <div className="tab-pane active">
        <Table
          data={ data }
          className="table table-condensed table-fixed table-striped"
        >
          <Section type="head" rows={this._renderHeadingRow} />
          <Section type="body" data={ data } rows={this._renderRows} />
        </Table>
      </div>
    );
  }
}
