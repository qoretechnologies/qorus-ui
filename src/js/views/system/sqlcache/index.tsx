/* @flow */
import React, { Component } from 'react';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module 'redux' or its corresponding ty... Remove this comment to see the full error message
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { map } from 'lodash';
import { Intent } from '@blueprintjs/core';

import Headbar from '../../../components/Headbar';
import Box from '../../../components/box';
import ConfirmDialog from '../../../components/confirm_dialog';
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
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
} from '../../../components/controls';
import Pull from '../../../components/Pull';
import Flex from '../../../components/Flex';
import NoDataIf from '../../../components/NoDataIf';

// @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
const sqlcacheSelector: Function = (state: Object) => state.api.sqlcache;
const formatData: Function = (): Function => (collection: Object) =>
  Object.keys(collection).reduce((result: Object, key: string): Object => {
    const coll = collection[key].tables;
    const newCollection: Array<Object> = map(
      coll,
      (propData, propKey): Object => ({ name: propKey, ...propData })
    );

    return { ...result, ...{ [key]: newCollection } };
  }, {});

// @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
const collectionSelector = createSelector(
  [sqlcacheSelector],
  model => formatData()(model.data)
);

const viewSelector = createSelector(
  // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
  [sqlcacheSelector, collectionSelector],
  (sqlcache: Object, collection: Object): Object => ({
    sqlcache,
    collection,
  })
);

class SQLCache extends Component {
  props: {
    location: Object,
    collection: Object,
    optimisticDispatch: Function,
    openModal: Function,
    closeModal: Function,
  } = this.props;

  handleClearAllClick: Function = (): void => {
    const confirmFunc: Function = (): void => {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'sqlcache' does not exist on type '{}'.
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
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'sqlcache' does not exist on type '{}'.
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
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'sqlcache' does not exist on type '{}'.
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
                icon="trash"
                onClick={this.handleClearAllClick}
                big
              />
            </ButtonGroup>
          </Pull>
        </Headbar>

        <NoDataIf condition={colLength === 0} big inBox>
          {() => (
            <Box top scrollY>
              {Object.keys(collection).map((col, index) => (
                <Table
                  key={col}
                  name={col}
                  data={collection[col]}
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
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'sqlcache' does not exist on type '{}'.
      load: actions.sqlcache.fetch,
    }
  ),
  withDispatch(),
  sync('sqlcache'),
  withModal(),
  titleManager('SQL Cache')
)(SQLCache);
