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
import Shorten from '../../../components/shorten';

import actions from 'store/api/actions';
import { browserHistory } from 'react-router';

const CONN_MAP = {
  datasources: 'DATASOURCE',
  user: 'USER-CONNECTION',
  qorus: 'REMOTE',
};

const remotesMetaSelector = (state) => ({
  sync: state.api.remotes.sync,
  loading: state.api.remotes.loading,
});

const remotesSelector = (state, props) => (
  state.api.remotes.data.filter(a =>
    (a.conntype.toLowerCase() === CONN_MAP[props.params.type].toLowerCase())
  )
);

const activeRowId = (state, props) => props.params.id;

const viewSelector = createSelector(
  [
    remotesSelector,
    remotesMetaSelector,
    activeRowId,
  ],
  (alerts, meta, rowId) => ({
    collection: alerts,
    sync: meta.sync,
    loading: meta.loading,
    activeRowId: rowId,
  })
);

@connect(viewSelector)
export default class AlertsTable extends Component {
  static propTypes = {
    collection: PropTypes.array,
    activeRowId: PropTypes.string,
    dispatch: PropTypes.func,
    sync: PropTypes.bool,
    loading: PropTypes.bool,
    route: PropTypes.object,
    children: PropTypes.node,
    location: PropTypes.object,
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
    this.props.dispatch(actions.remotes.fetch({ action: 'all' }));

    this._renderHeadingRow = ::this.renderHeadingRow;
    this._renderRows = ::this.renderRows;
    this._renderCells = ::this.renderCells;
  }

  /**
   * Changes active route to alert associated with clicked element.
   *
   * If the event handled some significant action before (i.e., its
   * default action is prevented), it does nothing.
   *
   * @param {Event} ev
   */
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
  }

  fixEslint() {}

  /**
   * Yields heading cells for model info.
   *
   * @return {Generator<ReactElement>}
   * @see ORDER_STATES
   */
  *renderHeadings() {
    yield (
      <Cell tag="th" className="narrow">Up</Cell>
    );

    yield (
      <Cell tag="th" className="narrow">
        <i className="fa fa-exclamation-triangle" />
      </Cell>
    );

    yield (
      <Cell tag="th" className="name">Name</Cell>
    );

    yield (
      <Cell tag="th" className="desc">Description</Cell>
    );

    yield (
      <Cell tag="th" />
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
        <i
          className={classNames(
            'fa fa-check-circle',
            { 'text-danger': !model.up, 'text-success': model.up }
          )}
        />
      </Cell>
    );

    yield (
      <Cell className="narrow">
        {model.alerts.length > 0 &&
          <i className="text-danger fa fa-exclamation-triangle" />
        }
      </Cell>
    );

    yield (
      <Cell className="name nowrap">{ model.name }</Cell>
    );

    yield (
      <Cell className="align-left nowrap">{ model.desc }</Cell>
    );

    yield (
      <Cell className="nowrap align-right">
        <button className="btn btn-success btn-xs">
           <i className="fa fa-exchange" /> Ping
        </button>
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
  *renderRows({ activeId, collection }) {
    for (const model of collection) {
      yield (
        <Row
          key={model.name}
          data={{ model }}
          cells={this._renderCells}
          onClick={this.activateRow(model.name)}
          className={classNames({
            info: model.id === activeId,
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
      activeId: this.props.params.id,
      collection: this.props.collection,
    };

    return (
      <div className="tab-pane active">
        <Table
          data={ data }
          className="table table-condensed table-fixed table-striped table--data table--align-left"
        >
          <Section type="head" rows={this._renderHeadingRow} />
          <Section type="body" data={ data } rows={this._renderRows} />
        </Table>
        { this.props.children }
      </div>
    );
  }
}
