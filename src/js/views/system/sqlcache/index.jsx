/* @flow */
import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { flowRight, pickBy, includes } from 'lodash';
import { Intent } from '@blueprintjs/core';

import Headbar from '../../../components/Headbar';
import Container from '../../../components/container';
import Box from '../../../components/box';
import NoData from '../../../components/nodata';
import ConfirmDialog from '../../../components/confirm_dialog';
import Search from '../../../containers/search';
import withDispatch from '../../../hocomponents/withDispatch';
import sync from '../../../hocomponents/sync';
import withModal from '../../../hocomponents/modal';
import Table from './table';
import actions from '../../../store/api/actions';
import { Breadcrumbs, Crumb } from '../../../components/breadcrumbs';
import titleManager from '../../../hocomponents/TitleManager';
import {
  Control as Button,
  Controls as ButtonGroup,
} from '../../../components/controls';
import Pull from '../../../components/Pull';
import queryControl from '../../../hocomponents/queryControl';
import Flex from '../../../components/Flex';
import NoDataIf from '../../../components/NoDataIf';

const sqlcacheSelector: Function = (state: Object) => state.api.sqlcache;
const querySelector: Function = (state: Object, props: Object): ?string =>
  props.location.query.search;
const filterData: Function = (query: ?string): Function => (
  collection: Object
) => {
  if (!query) return collection;

  const datasources: Array<string> = Object.keys(collection);
  const result: Object = {};

  datasources.forEach(ds => {
    result[ds] = {};
    result[ds].tables = pickBy(collection[ds].tables, (value, key) =>
      includes(key, query)
    );
  });

  return result;
};

const collectionSelector = createSelector(
  [sqlcacheSelector, querySelector],
  (model, query) => flowRight(filterData(query))(model.data)
);

const viewSelector = createSelector(
  [sqlcacheSelector, querySelector, collectionSelector],
  (sqlcache: Object, query: ?string, collection: Object): Object => ({
    sqlcache,
    query,
    collection,
  })
);

class SQLCache extends Component {
  props: {
    location: Object,
    collection: Object,
    searchQuery: ?string,
    changeSearchQuery: Function,
    optimisticDispatch: Function,
    openModal: Function,
    closeModal: Function,
  };

  handleClearAllClick: Function = (): void => {
    const confirmFunc: Function = (): void => {
      this.props.optimisticDispatch(actions.sqlcache.clearCache, null, null);
      this.props.closeModal();
    };

    this.props.openModal(
      <ConfirmDialog onClose={this.props.closeModal} onConfirm={confirmFunc}>
        Are you sure you want to clear <strong>all</strong> cache?
      </ConfirmDialog>
    );
  };

  handleClearDatasourceClick: Function = (datasource): void => {
    const confirmFunc: Function = (): void => {
      this.props.optimisticDispatch(
        actions.sqlcache.clearCache,
        datasource,
        null
      );
      this.props.closeModal();
    };

    this.props.openModal(
      <ConfirmDialog onClose={this.props.closeModal} onConfirm={confirmFunc}>
        Are you sure you want to clear cache of datasource{' '}
        <strong>{datasource}</strong>?
      </ConfirmDialog>
    );
  };

  handleClearSingleClick: Function = (datasource, name): void => {
    const confirmFunc: Function = (): void => {
      this.props.optimisticDispatch(
        actions.sqlcache.clearCache,
        datasource,
        name
      );
      this.props.closeModal();
    };

    this.props.openModal(
      <ConfirmDialog onClose={this.props.closeModal} onConfirm={confirmFunc}>
        Are you sure you want to clear cache <strong>{name}</strong> of
        datasource {datasource}?
      </ConfirmDialog>
    );
  };

  render() {
    const { collection } = this.props;
    const colLength = Object.keys(collection).length;

    return (
      <Flex>
        <Headbar>
          <Breadcrumbs>
            <Crumb active> SQL Cache </Crumb>
          </Breadcrumbs>
          <Pull right>
            <ButtonGroup marginRight={3}>
              <Button
                intent={Intent.DANGER}
                text="Clear All"
                iconName="trash"
                onClick={this.handleClearAllClick}
                big
              />
            </ButtonGroup>
            <Search
              defaultValue={this.props.searchQuery}
              onSearchUpdate={this.props.changeSearchQuery}
              resource="sqlcache"
            />
          </Pull>
        </Headbar>

        <NoDataIf condition={colLength === 0} big inBox>
          {() => (
            <Box top scrollY>
              {Object.keys(this.props.collection).map((col, index) => (
                <Table
                  key={index}
                  name={col}
                  data={this.props.collection[col].tables}
                  dataLen={Object.keys(this.props.collection[col].tables)}
                  onClick={this.handleClearDatasourceClick}
                  onSingleClick={this.handleClearSingleClick}
                />
              ))}
            </Box>
          )}
        </NoDataIf>
      </Flex>
    );
  }
}

export default compose(
  connect(
    viewSelector,
    {
      load: actions.sqlcache.fetch,
    }
  ),
  withDispatch(),
  queryControl('search'),
  sync('sqlcache'),
  withModal(),
  titleManager('SQL Cache')
)(SQLCache);
