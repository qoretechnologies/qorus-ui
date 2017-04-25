/* @flow */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import compose from 'recompose/compose';
import { includes, flowRight } from 'lodash';

import actions from '../../../store/api/actions';
import Prop from './prop';
import Search from '../../../containers/search';
import Modal from './modal';
import PermButton from './perm_control';
import sync from '../../../hocomponents/sync';
import search from '../../../hocomponents/search';
import modal from '../../../hocomponents/modal';
import Toolbar from '../../../components/toolbar';

const dataSelector: Function = (state: Object): Object => state.api.props;
const querySelector: Function = (state: Object, props: Object): Object => props.location.query.q;
const filterData = (query: string): Function => (collection: Object): Object => {
  if (!query) return collection;

  return Object.keys(collection).reduce((n, k) => {
    const obj = Object.keys(collection[k]).reduce((deep, deepkey) => (
      includes(deepkey, query) || includes(collection[k][deepkey], query) ?
        Object.assign(deep, { [deepkey]: collection[k][deepkey] }) :
        deep
    ), {});

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
  [
    dataSelector,
    querySelector,
  ], (properties, query) => flowRight(
    filterData(query)
  )(properties.data)
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
      addProp: actions.props.addProp,
      updateProp: actions.props.updateProp,
      removeProp: actions.props.removeProp,
    }
  ),
  modal(),
  search(),
  sync('properties')
)
export default class PropertiesView extends Component {
  static propTypes = {
    collection: PropTypes.object,
    user: PropTypes.object,
    openModal: PropTypes.func,
    closeModal: PropTypes.func,
    addProp: PropTypes.func,
    updateProp: PropTypes.func,
    removeProp: PropTypes.func,
    query: PropTypes.string,
    onSearchChange: PropTypes.func,
  };

  handleAddClick = (event: EventHandler, data: Object) => {
    const onSubmit = data ? this.handleEditFormSubmit : this.handleAddFormSubmit;

    this.props.openModal(
      <Modal
        onClose={this.props.closeModal}
        onSubmit={onSubmit}
        data={data}
        collection={this.props.collection}
      />
    );
  };

  handleAddFormSubmit = (data: Object) => {
    this.props.addProp(data);
  };

  handleEditFormSubmit = (data: Object) => {
    this.props.updateProp(data);
  };

  handleDeleteClick = (prop: Object) => {
    this.props.removeProp(prop);
  };

  renderProperties() {
    const { collection, user } = this.props;

    if (!Object.keys(collection).length) return null;

    return Object.keys(collection).map((p, key) => (
      <Prop
        data={collection[p]}
        title={p}
        perms={user.data.permissions}
        key={key}
        onDelete={this.handleDeleteClick}
        onEdit={this.handleAddClick}
      />
    ));
  }

  render() {
    return (
      <div className="tab-pane active">
        <Toolbar sticky>
          <PermButton
            perms={this.props.user.data.permissions}
            reqPerms={['SERVER-CONTROL', 'SET-PROPERTY']}
            label="Add property"
            big
            btnStyle="success"
            icon="plus"
            className="pull-left"
            onClick={this.handleAddClick}
          />
          <Search
            onSearchUpdate={this.props.onSearchChange}
            defaultValue={this.props.query}
            resource="properties"
          />
        </Toolbar>
        { this.renderProperties() }
      </div>
    );
  }
}
