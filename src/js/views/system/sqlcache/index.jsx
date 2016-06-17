import React, { PropTypes, Component } from 'react';

import Table, { Section, Cell, Row } from '../../../components/table';
import Loader from '../../../components/loader';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import actions from 'store/api/actions';

const collectionSelector = (state) => {
  return state.api.sqlcache.data;
};

const metaSelector = (state) => {
  return {
    sync: state.api.sqlcache.sync,
    loading: state.api.sqlcache.loading,
  };
};

const tablesSelector = (state) => {
  return Object.keys(state.api.sqlcache.data);
};

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

    this.props.dispatch(actions.sqlcache.fetch());
  }

  *renderHeadings() {
    yield (
      <Cell type="th">
        Name
      </Cell>
    );

    yield (
      <Cell type="th">
        Count
      </Cell>
    );

    yield (
      <Cell type="th">
        created
      </Cell>
    );

    yield (
      <Cell type="th" />
    );
  }

  *renderCells(row) {
    yield (
      <Cell>
        <a href={ row.url } blank>{ row.name }</a>
      </Cell>
    );

    yield (
      <Cell>
        { row.count }
      </Cell>
    );

    yield (
      <Cell>
        <Date date={ row.created } />
      </Cell>
    );

    yield (
      <Cell>
        <a className="btn btn-danger">
          <i className="fa fa-thrash" /> Clear
        </a>
      </Cell>
    );
  }

  *renderRows(collection) {
    for (const model of collection) {
      yield (
        <Row
          key={model.url}
          data={ model }
          cells={this._renderCells}
        />
      );
    }
  }

  *renderTables(tables) {
    const collection = this.props.collection;

    for (const table of tables) {
      yield (
        <div key={table}>
          <div className="row-fluid">
            <h3>{ table }</h3>
            <div className="floatLeft col-xs-2">
              <a className="btn btn-danger">
                <i className="fa fa-thrash" />
                Clear datasource
              </a>
            </div>
          </div>
          <Table className="table table-data table-striped table-condensed">
            <Section
              type="body"
              data={ collection.filter((m) => m.group === name) }
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
        { this.renderTables(this.props.tables) }
      </div>
    );
  }
}
