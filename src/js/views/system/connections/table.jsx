/* @flow */
import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { compose } from 'redux';
import { createSelector } from 'reselect';
import defaultProps from 'recompose/defaultProps';
import classNames from 'classnames';

import Table, { Cell, Section, Row } from '../../../components/table';
import { Controls, Control as Button } from '../../../components/controls';
import AutoComponent from '../../../components/autocomponent';
import ModalPing from './modals/ping';
import sync from '../../../hocomponents/sync';
import patch from '../../../hocomponents/patchFuncArgs';
import checkNoData from '../../../hocomponents/check-no-data';

import actions from '../../../store/api/actions';
import { browserHistory } from 'react-router';

const CONN_MAP: Object = {
  datasources: 'DATASOURCE',
  user: 'USER-CONNECTION',
  qorus: 'REMOTE',
};

const remotesSel: Function = (state: Object): Object => state.api.remotes;
const remotesSelector: Function = (state: Object, props: Object): Array<*> => (
  state.api.remotes.data.filter(a =>
    (a.conntype.toLowerCase() === CONN_MAP[props.params.type].toLowerCase())
  )
);

const activeRowId: Function = (state: Object, props: Object): string => props.params.id;

const viewSelector: Function = createSelector(
  [
    remotesSel,
    remotesSelector,
    activeRowId,
  ],
  (remotes, alerts, rowId) => ({
    remotes,
    collection: alerts,
    activeRowId: rowId,
  })
);

class Connections extends Component {
  static defaultProps = {
    activeRowId: null,
  };

  static contextTypes = {
    openModal: PropTypes.func,
    closeModal: PropTypes.func,
  };

  props: {
    activeRowId: string,
    route: Object,
    children: any,
    location: Object,
    params: Object,
    load: Function,
    collection: Array<any>,
    updateDone: Function,
  };

  componentWillMount() {
    this._renderHeadings = this.renderHeadings.bind(this);
    this._renderHeadingRow = this.renderHeadingRow.bind(this);
    this._renderRows = this.renderRows.bind(this);
    this._renderCells = this.renderCells.bind(this);
  }

  _renderHeadings: ?Function = null;
  _renderHeadingRow: ?Function = null;
  _renderRows: ?Function = null;
  _renderCells: ?Function = null;
  _modal: ?React.Element<any> = null;

  activateRow: Function= (modelId: number): Function => (ev: EventHandler): void => {
    if (ev.defaultPrevented) return;

    const shouldDeactivate: boolean = modelId === this.props.activeRowId;

    const urlChunks: Array<any> = this.props.location.pathname.split('/');
    const url: string = urlChunks.length === 5 ?
      urlChunks.slice(0, 4).join('/') :
      urlChunks.join('/');

    if (shouldDeactivate) {
      browserHistory.push(url);
    } else {
      browserHistory.push(`${url}/${modelId}`);
    }
  };

  handleOpenModal: Function = (model: Object): Function => (ev: EventHandler): void => {
    ev.preventDefault();

    this.openModal(model);
  };

  openModal: Function = (model: Object): void => {
    this._modal = (
      <ModalPing
        model={model}
        onClose={this.handlecloseModal}
        type={this.props.params.type}
      />
    );

    this.context.openModal(this._modal);
  };

  handlecloseModal: Function = (): void => {
    this.context.closeModal(this._modal);
    this._modal = null;
  };

  handleHighlightEnd: Function = (name: string): Function => (): void => {
    this.props.updateDone(name);
  };

  *renderHeadings(): Generator<*, *, *> {
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

  *renderCells({ model }: { model: Object }): Generator<*, *, *> {
    yield (
      <Cell className="narrow">
        <AutoComponent>
          { model.up }
        </AutoComponent>
      </Cell>
    );

    yield (
      <Cell className="narrow">
        {model.alerts.length > 0 &&
          <Controls>
            <Button
              icon="warning"
              btnStyle="danger"
            />
          </Controls>
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
        <button className="btn btn-success btn-xs" onClick={this.handleOpenModal(model)}>
           <i className="fa fa-exchange" /> Ping
        </button>
      </Cell>
    );
  }

  *renderHeadingRow(): Generator<*, *, *> {
    yield (
      <Row cells={this._renderHeadings} />
    );
  }

  *renderRows(
    { activeId, collection }: { activeId: number, collection: Object }
  ): Generator<*, *, *> {
    for (const model of collection) {
      yield (
        <Row
          key={model.name}
          data={{ model }}
          cells={this._renderCells}
          onClick={this.activateRow(model.name)}
          highlight={model._updated}
          onHighlightEnd={this.handleHighlightEnd(model.name)}
          className={classNames({
            info: model.id === activeId,
          })}
        />
      );
    }
  }

  render() {
    const data: Object = {
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

Connections.propTypes = {
  activeRowId: PropTypes.string,
  route: PropTypes.object,
  children: PropTypes.node,
  location: PropTypes.object,
  params: PropTypes.object,
  load: PropTypes.func.isRequired,
  collection: PropTypes.array,
  updateDone: PropTypes.func,
};

export default compose(
  connect(
    viewSelector,
    {
      load: actions.remotes.fetch,
      updateDone: actions.remotes.updateDone,
    }
  ),
  defaultProps({ query: { action: 'all' } }),
  patch('load', ['query']),
  sync('remotes'),
  checkNoData(({ collection }: { collection: Array<Object> }): number => collection.length)
)(Connections);
