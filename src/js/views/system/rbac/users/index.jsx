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
import { findBy } from '../../../../helpers/search';
import { hasPermission } from '../../../../helpers/user';
import Modal from './modal';
import Table from './table';
import AddButton from '../add_button';
import actions from '../../../../store/api/actions';

const currentUserSelector: Function = (state: Object): Object => state.api.currentUser;
const usersSelector: Function = (state: Object): Object => state.api.users;
const querySelector: Function = (state: Object, props: Object): ?string => props.location.query.q;
const filterData: Function = (query: ?string): Function => (collection: Array<*>) => (
  findBy(['name', 'username'], query, collection)
);

const collectionSelector: Function = createSelector(
  [
    usersSelector,
    querySelector,
  ], (collection, query) => flowRight(
    filterData(query)
  )(collection.data)
);

const viewSelector: Function = createSelector(
  [
    currentUserSelector,
    usersSelector,
    querySelector,
    collectionSelector,
  ], (currentUser, users, query, collection) => ({
    user: currentUser.data,
    users,
    query,
    usersModel: collection,
  })
);

@compose(
  connect(
    viewSelector,
    {
      load: actions.users.fetch,
      createUser: actions.users.createUser,
      removeUser: actions.users.removeUser,
      updateUser: actions.users.updateUser,
    }
  ),
  search('users', 'system/rbac/users'),
  modal(),
  sync('users')
)
export default class RBACUsers extends Component {
  props:{
    onSearchChange: Function,
    query: string,
    usersModel: Array<*>,
    user: Object,
    openModal: Function,
    closeModal: Function,
    createUser: Function,
    removeUser: Function,
    updateUser: Function,
  };

  handleAddUserClick: Function = (): void => {
    this.props.openModal(
      <Modal
        onClose={this.props.closeModal}
        onSave={this.handleCreateUserClick}
        users={this.props.usersModel}
        title="Add user"
      />
    );
  };

  handleEditUserClick: Function = (model): void => {
    this.props.openModal(
      <Modal
        onClose={this.props.closeModal}
        onSave={this.handleUpdateUserClick}
        users={this.props.usersModel}
        title="Edit user"
        model={model}
      />
    );
  };

  handleCreateUserClick: Function = async (
    name: string,
    username: string,
    password: string,
    roles: Array<string>,
  ): Promise<*> => {
    await this.props.createUser(
      name,
      username,
      password,
      roles
    );

    this.props.closeModal();
  };

  handleUpdateUserClick: Function = async (
    name: string,
    username: string,
    roles: Array<string>,
  ): Promise<*> => {
    await this.props.updateUser(
      name,
      username,
      roles
    );

    this.props.closeModal();
  };

  handleRemoveUserClick: Function = (username): void => {
    this.props.removeUser(username);
  };

  render() {
    const { permissions } = this.props.user;
    const canEdit = hasPermission(permissions, ['USER-CONTROL', 'MODIFY-USER'], 'or');
    const canDelete = hasPermission(permissions, ['USER-CONTROL', 'DELETE-USER'], 'or');

    return (
      <div className="tab-content">
        <div className="tab-pane active">
          <Toolbar>
            <div className="pull-left">
              <AddButton
                perms={permissions}
                reqPerms={['USER-CONTROL', 'ADD-USER']}
                title="Add user"
                onClick={this.handleAddUserClick}
              />
            </div>
            <Search
              onSearchUpdate={this.props.onSearchChange}
              defaultValue={this.props.query}
            />
          </Toolbar>
          <Table
            collection={this.props.usersModel}
            canEdit={canEdit}
            canDelete={canDelete}
            onDeleteClick={this.handleRemoveUserClick}
            onEditClick={this.handleEditUserClick}
          />
        </div>
      </div>
    );
  }
}
