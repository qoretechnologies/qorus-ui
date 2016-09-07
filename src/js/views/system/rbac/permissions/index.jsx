/* @flow */
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import flowRight from 'lodash/flowRight';

import search from '../../../../hocomponents/search';
import sync from '../../../../hocomponents/sync';
import modal from '../../../../hocomponents/modal';
import Search from '../../../../components/search';
import Toolbar from '../../../../components/toolbar';
import AddButton from '../add_button';
import { findBy } from '../../../../helpers/search';
import { hasPermission } from '../../../../helpers/user';
import Modal from './modal';
import Table from './table';

import actions from '../../../../store/api/actions';

const currentUserSelector: Function = (state: Object): Object => state.api.currentUser;
const permsSelector: Function = (state: Object): Object => state.api.perms;
const querySelector: Function = (state: Object, props: Object): ?string => props.location.query.q;
const filterData: Function = (query: ?string): Function => (collection: Array<*>) => (
  findBy(['type', 'name', 'desc'], query, collection)
);

const collectionSelector: Function = createSelector(
  [
    permsSelector,
    querySelector,
  ], (collection, query) => flowRight(
    filterData(query)
  )(collection.data)
);

const viewSelector: Function = createSelector(
  [
    currentUserSelector,
    permsSelector,
    querySelector,
    collectionSelector,
  ], (currentUser, perms, query, collection) => ({
    user: currentUser.data,
    perms,
    query,
    permsModel: collection,
  })
);

@compose(
  connect(
    viewSelector,
    {
      load: actions.perms.fetch,
      createPerm: actions.perms.createPerm,
      updatePerm: actions.perms.updatePerm,
      removePerm: actions.perms.removePerm,
    }
  ),
  search(),
  modal(),
  sync('perms'),
)
export default class RBACPerms extends Component {
  props:{
    onSearchChange: Function,
    query: string,
    permsModel: Array<*>,
    openModal: Function,
    closeModal: Function,
    createPerm: Function,
    updatePerm: Function,
    removePerm: Function,
    user: Object,
  };

  handleAddPermClick: Function = (): void => {
    this.props.openModal(
      <Modal
        onClose={this.props.closeModal}
        onSave={this.handleCreatePermClick}
        perms={this.props.permsModel}
        title="Add permission"
      />
    );
  };

  handleEditPermClick: Function = (model): void => {
    this.props.openModal(
      <Modal
        onClose={this.props.closeModal}
        onSave={this.handleUpdatePermClick}
        perms={this.props.permsModel}
        model={model}
        title="Edit permission"
      />
    );
  };

  handleCreatePermClick: Function = async (
    name: string,
    desc: string,
  ): Promise<*> => {
    await this.props.createPerm(
      name,
      desc
    );

    this.props.closeModal();
  };

  handleUpdatePermClick: Function = async (
    name: string,
    desc: string,
  ): Promise<*> => {
    await this.props.updatePerm(
      name,
      desc
    );

    this.props.closeModal();
  };

  handleRemovePermClick: Function = (name): void => {
    this.props.removePerm(name);
  };

  render() {
    const { permissions } = this.props.user;
    const canEdit = hasPermission(permissions, ['USER-CONTROL', 'MODIFY-PERMISSION'], 'or');
    const canDelete = hasPermission(permissions, ['USER-CONTROL', 'DELETE-PERMISSION'], 'or');

    return (
      <div className="tab-content">
        <div className="tab-pane active">
          <Toolbar>
            <div className="pull-left">
              <AddButton
                perms={permissions}
                reqPerms={['USER-CONTROL', 'ADD-PERMISSION']}
                title="Add permission"
                onClick={this.handleAddPermClick}
              />
            </div>
            <Search
              onSearchUpdate={this.props.onSearchChange}
              defaultValue={this.props.query}
            />
          </Toolbar>
          <Table
            collection={this.props.permsModel}
            onDeleteClick={this.handleRemovePermClick}
            onEditClick={this.handleEditPermClick}
            canEdit={canEdit}
            canDelete={canDelete}
          />
        </div>
      </div>
    );
  }
}
