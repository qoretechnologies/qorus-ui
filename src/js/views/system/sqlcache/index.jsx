/* @flow */
import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { flowRight, pickBy, includes } from 'lodash';

import Toolbar from '../../../components/toolbar';
import Search from '../../../containers/search';
import { Control as Button } from '../../../components/controls';
import search from '../../../hocomponents/search';
import sync from '../../../hocomponents/sync';
import Table from './table';

import actions from '../../../store/api/actions';

const sqlcacheSelector: Function = (state: Object) => state.api.sqlcache;
const querySelector: Function = (state: Object, props: Object): ?string => props.location.query.q;
const filterData: Function = (query: ?string): Function => (collection: Object) => {
  if (!query) return collection;

  const datasources: Array<string> = Object.keys(collection);
  const result: Object = {};

  datasources.forEach(ds => {
    result[ds] = {};
    result[ds].tables = pickBy(collection[ds].tables, (value, key) => includes(key, query));
  });

  return result;
};

const collectionSelector = createSelector(
  [
    sqlcacheSelector,
    querySelector,
  ], (model, query) => flowRight(
    filterData(query)
  )(model.data)
);

const viewSelector = createSelector(
  [
    sqlcacheSelector,
    querySelector,
    collectionSelector,
  ], (sqlcache: Object, query: ?string, collection: Object): Object => ({
    sqlcache,
    query,
    collection,
  })
);

class SQLCache extends Component {
  props:{
    location: Object,
    collection: Object,
    query: ?string,
    onSearchChange: Function,
    clearCache: Function
  };

  handleClearAllClick: Function = (): void => {
    this.props.clearCache();
  };

  handleClearDatasourceClick: Function = (datasource): void => {
    this.props.clearCache(datasource);
  };

  handleClearSingleClick: Function = (datasource, name): void => {
    this.props.clearCache(datasource, name);
  };

  render() {
    const { collection } = this.props;
    const colLength = Object.keys(collection).length;

    return (
      <div className="tab-pane active">
        <Toolbar sticky>
          <Button
            btnStyle="danger"
            label="Clear All"
            icon="trash-o"
            big
            action={this.handleClearAllClick}
          />
          <Search
            defaultValue={this.props.query}
            onSearchUpdate={this.props.onSearchChange}
            resource="sqlcache"
          />
        </Toolbar>
        <div>
          { colLength > 0 && (
            Object.keys(this.props.collection).map((col, index) => (
              <Table
                key={index}
                name={col}
                data={this.props.collection[col].tables}
                onClick={this.handleClearDatasourceClick}
                onSingleClick={this.handleClearSingleClick}
              />
            ))
          )}
          { colLength <= 0 && (
            <p> No data </p>
          )}
        </div>
      </div>
    );
  }
}

export default compose(
  connect(
    viewSelector,
    {
      load: actions.sqlcache.fetch,
      clearCache: actions.sqlcache.clearCache,
    }
  ),
  search(),
  sync('sqlcache')
)(SQLCache);
