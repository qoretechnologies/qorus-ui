import React, { PropTypes, Component } from 'react';

import Table, { Section, Cell, Row } from '../../../components/table';
import Loader from '../../../components/loader';
import DateComponent from '../../../components/date';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import actions from 'store/api/actions';

import { isObject } from 'lodash';

const collectionSelector = (state) => {
  const collection = [];
  const col = state.api.sqlcache.data;

  if (isObject(col)) {
    Object.keys(col).forEach(k => (
      collection.push(Object.assign({ datasource: k }, col[k]))
    ));
    return collection;
  }
  return col;
};

const metaSelector = (state) => (
  {
    sync: state.api.sqlcache.sync,
    loading: state.api.sqlcache.loading,
  }
);

const tablesSelector = (state) => Object.keys(state.api.sqlcache.data);

const viewSelector = createSelector(
  [
    collectionSelector,
    metaSelector,
    tablesSelector,
  ],
  (collection, meta, tables) => ({
    collection,
    sync: meta.sync,
    loading: meta.loading,
    tables,
  })
);


@connect(viewSelector)
export default class SqlCache extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    sync: PropTypes.bool,
    loading: PropTypes.bool,
    tables: PropTypes.array,
    collection: PropTypes.array,
  }

  componentWillMount() {
    this._renderCells = ::this.renderCells;
    this._renderRows = ::this.renderRows;
    this._renderHeadings = ::this.renderHeadings;

    this.props.dispatch(actions.sqlcache.fetch());
  }

  *renderHeadings() {
    yield (
      <Cell tag="th">
        Name
      </Cell>
    );

    yield (
      <Cell tag="th" className="narrow">
        Count
      </Cell>
    );

    yield (
      <Cell tag="th" className="narrow">
        Created
      </Cell>
    );

    yield (
      <Cell tag="th" className="narrow" />
    );
  }

  *renderCells(row) {
    yield (
      <Cell>
        { row.name }
      </Cell>
    );

    yield (
      <Cell>
        { row.count }
      </Cell>
    );

    yield (
      <Cell>
        <DateComponent date={ row.created } />
      </Cell>
    );

    yield (
      <Cell className="align-right">
        <a className="btn btn-danger btn-xs">
          <i className="fa fa-trash" /> Clear
        </a>
      </Cell>
    );
  }

  *renderRows(collection) {
    for (const model of collection) {
      yield (
        <Row
          key={model.name}
          data={ model }
          cells={this._renderCells}
        />
      );
    }
  }

  *renderTables() {
    const collection = this.props.collection;
    const tables = this.props.tables;

    for (const table of tables) {
      const col = [];
      const selectedGroup = collection.find(m => m.datasource === table).tables;

      Object.keys(selectedGroup).forEach(r => (
        col.push(Object.assign({ name: r }, selectedGroup[r]))
      ));

      yield (
        <div key={table}>
          <div className="row-fluid">
            <h3 className="col-xs-8">{ table }</h3>
            <div className="pull-right col-xs-2 text-right">
              <a
                className="btn btn-danger btn-xs"
                style={{ position: 'absolute', top: '2em', right: 0 }}
              >
                <i className="fa fa-trash" /> Clear datasource
              </a>
            </div>
          </div>
          <Table className="table table-data table-striped table-condensed" data={ col }>
            <Section type="head">
              { React.Children.toArray(this._renderHeadings()) }
            </Section>
            <Section
              type="body"
              data={ col }
              rows={this._renderRows}
            />
          </Table>
        </div>
      );
    }
  }

  render() {
    if (!this.props.sync || this.props.loading) {
      return <Loader />;
    }

    return (
      <div>
        { React.Children.toArray(this.renderTables()) }
      </div>
    );
  }
}
