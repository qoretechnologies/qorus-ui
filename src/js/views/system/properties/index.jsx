/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import compose from 'recompose/compose';
import { omit, map, size, flow, includes } from 'lodash';

import { Breadcrumbs, Crumb } from '../../../components/breadcrumbs';
import actions from '../../../store/api/actions';
import Prop from './prop';
import Modal from './modal';
import sync from '../../../hocomponents/sync';
import modal from '../../../hocomponents/modal';
import withDispatch from '../../../hocomponents/withDispatch';
import Headbar from '../../../components/Headbar';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../../components/controls';
import Box from '../../../components/box';
import { hasPermission } from '../../../helpers/user';
import titleManager from '../../../hocomponents/TitleManager';
import Pull from '../../../components/Pull';
import Flex from '../../../components/Flex';
import NoDataIf from '../../../components/NoDataIf';
import { querySelector } from '../../../selectors';
import { findBy } from '../../../helpers/search';
import Search from '../../../containers/search';
import queryControl from '../../../hocomponents/queryControl';

const dataSelector: Function = (state: Object): Object => state.api.props;
const filterProperties: Function = (query: string): Function => (
  collection: Object
): Object => {
  if (!query) return collection;

  return Object.keys(collection).reduce((n, k) => {
    const obj = Object.keys(collection[k]).reduce(
      (deep, deepkey) =>
        includes(deepkey, query) || includes(collection[k][deepkey], query)
          ? Object.assign(deep, { [deepkey]: collection[k][deepkey] })
          : deep,
      {}
    );

    if (Object.keys(obj).length) {
      return Object.assign(n, { [k]: obj });
    }

    if (includes(k, query)) {
      return Object.assign(n, { [k]: collection[k] });
    }

    return n;
  }, {});
};

const formatData = (): Function => (collection: Object): Object =>
  Object.keys(collection).reduce((result: Object, key: string): Object => {
    const coll = collection[key];
    const newCollection: Array<Object> = map(
      coll,
      (propData, propKey): Object => ({ name: propKey, prop: propData })
    );

    return { ...result, ...{ [key]: newCollection } };
  }, {});

const collectionSelector = createSelector(
  [dataSelector, querySelector('search')],
  (properties, search) =>
    flow(
      filterProperties(search),
      formatData()
    )(properties.data)
);

const viewSelector = createSelector(
  [dataSelector, state => state.api.currentUser, collectionSelector],
  (properties, user, collection) => ({
    properties,
    user,
    collection,
  })
);

@compose(
  connect(
    viewSelector,
    {
      load: actions.props.fetch,
    }
  ),
  withDispatch(),
  modal(),
  sync('properties')
)
@titleManager('Properties')
@queryControl('search')
export default class PropertiesView extends Component {
  props: {
    collection: Object,
    user: Object,
    openModal: Function,
    closeModal: Function,
    optimisicDispatch: Function,
    changeSearchQuery: Function,
    searchQuery: string,
  } = this.props;

  handleAddClick = (event: EventHandler, data: Object) => {
    const onSubmit = data
      ? this.handleEditFormSubmit
      : this.handleAddFormSubmit;
    const collection = omit(this.props.collection, 'omq');

    this.props.openModal(
      <Modal
        onClose={this.props.closeModal}
        onSubmit={onSubmit}
        data={data}
        collection={collection}
      />
    );
  };

  handleAddFormSubmit = (data: Object) => {
    this.props.optimisticDispatch(actions.props.manageProp, data);
  };

  handleEditFormSubmit = (data: Object) => {
    this.props.optimisticDispatch(actions.props.manageProp, data);
  };

  handleDeleteClick = (prop: Object) => {
    this.props.optimisticDispatch(actions.props.removeProp, prop);
  };

  render() {
    const { collection, user, changeSearchQuery, searchQuery } = this.props;

    return (
      <Flex>
        <Headbar>
          <Breadcrumbs>
            <Crumb active> Properties </Crumb>
          </Breadcrumbs>
          <Pull right>
            <ButtonGroup>
              <Button
                disabled={
                  !hasPermission(
                    this.props.user.data.permissions,
                    ['SERVER-CONTROL', 'SET-PROPERTY'],
                    'or'
                  )
                }
                text="Add property"
                iconName="add"
                onClick={this.handleAddClick}
                big
              />
            </ButtonGroup>
            <Search
              onSearchUpdate={changeSearchQuery}
              defaultValue={searchQuery}
              resource="properties"
            />
          </Pull>
        </Headbar>
        <NoDataIf condition={size(collection) === 0} big inBox>
          {() => (
            <Box top scrollY>
              {map(collection, (data: Object, name: string) => (
                <Prop
                  data={data}
                  title={name}
                  perms={user.data.permissions}
                  key={name}
                  onDelete={this.handleDeleteClick}
                  onEdit={this.handleAddClick}
                  openModal={this.props.openModal}
                  closeModal={this.props.closeModal}
                />
              ))}
            </Box>
          )}
        </NoDataIf>
      </Flex>
    );
  }
}
