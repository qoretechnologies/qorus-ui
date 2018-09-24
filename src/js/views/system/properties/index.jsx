/* @flow */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import compose from 'recompose/compose';
import { includes, flowRight, omit } from 'lodash';
import { Button, Intent } from '@blueprintjs/core';

import { Breadcrumbs, Crumb } from '../../../components/breadcrumbs';
import actions from '../../../store/api/actions';
import Prop from './prop';
import Search from '../../../containers/search';
import Modal from './modal';
import sync from '../../../hocomponents/sync';
import search from '../../../hocomponents/search';
import modal from '../../../hocomponents/modal';
import Toolbar from '../../../components/toolbar';
import Container from '../../../components/container';
import Box from '../../../components/box';
import { hasPermission } from '../../../helpers/user';
import titleManager from '../../../hocomponents/TitleManager';

const dataSelector: Function = (state: Object): Object => state.api.props;
const querySelector: Function = (state: Object, props: Object): Object =>
  props.location.query.q;
const filterData = (query: string): Function => (
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

const collectionSelector = createSelector(
  [dataSelector, querySelector],
  (properties, query) => flowRight(filterData(query))(properties.data)
);

const viewSelector = createSelector(
  [
    dataSelector,
    state => state.api.currentUser,
    querySelector,
    collectionSelector,
  ],
  (properties, user, query, collection) => ({
    properties,
    user,
    query,
    collection,
  })
);

@compose(
  connect(
    viewSelector,
    {
      load: actions.props.fetch,
      manageProp: actions.props.manageProp,
      removeProp: actions.props.removeProp,
    }
  ),
  modal(),
  search(),
  sync('properties')
)
@titleManager('Properties')
export default class PropertiesView extends Component {
  static propTypes = {
    collection: PropTypes.object,
    user: PropTypes.object,
    openModal: PropTypes.func,
    closeModal: PropTypes.func,
    manageProp: PropTypes.func,
    removeProp: PropTypes.func,
    query: PropTypes.string,
    onSearchChange: PropTypes.func,
  };

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
    this.props.manageProp(data);
  };

  handleEditFormSubmit = (data: Object) => {
    this.props.manageProp(data);
  };

  handleDeleteClick = (prop: Object) => {
    this.props.removeProp(prop);
  };

  renderProperties() {
    const { collection, user } = this.props;

    if (!Object.keys(collection).length) return null;

    return Object.keys(collection).map((p, key) => (
      <Box top={key === 0}>
        <Prop
          data={collection[p]}
          title={p}
          perms={user.data.permissions}
          key={key}
          onDelete={this.handleDeleteClick}
          onEdit={this.handleAddClick}
          openModal={this.props.openModal}
          closeModal={this.props.closeModal}
        />
      </Box>
    ));
  }

  render() {
    return (
      <div>
        <Toolbar marginBottom>
          <Breadcrumbs>
            <Crumb> Properties </Crumb>
          </Breadcrumbs>
          <Search
            onSearchUpdate={this.props.onSearchChange}
            defaultValue={this.props.query}
            resource="properties"
          />{' '}
          {hasPermission(
            this.props.user.data.permissions,
            ['SERVER-CONTROL', 'SET-PROPERTY'],
            'or'
          ) && (
            <Button
              text="Add property"
              intent={Intent.PRIMARY}
              iconName="add"
              className="pull-right"
              onClick={this.handleAddClick}
            />
          )}{' '}
        </Toolbar>
        <Container>{this.renderProperties()}</Container>
      </div>
    );
  }
}
