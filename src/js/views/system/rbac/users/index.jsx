/* @flow */
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import flowRight from 'lodash/flowRight';
import { Button, Intent } from '@blueprintjs/core';

import search from '../../../../hocomponents/search';
import sync from '../../../../hocomponents/sync';
import modal from '../../../../hocomponents/modal';
import Search from '../../../../containers/search';
import Toolbar from '../../../../components/toolbar';
import ConfirmDialog from '../../../../components/confirm_dialog';
import { findBy } from '../../../../helpers/search';
import { hasPermission } from '../../../../helpers/user';
import Modal from './modal';
import Table from './table';
import actions from '../../../../store/api/actions';

const currentUserSelector: Function = (state: Object): Object =>
  state.api.currentUser;
const usersSelector: Function = (state: Object): Object => state.api.users;
const querySelector: Function = (state: Object, props: Object): ?string =>
  props.location.query.q;
const filterData: Function = (query: ?string): Function => (
  collection: Array<*>
) => findBy(['name', 'username'], query, collection);

const collectionSelector: Function = createSelector(
  [usersSelector, querySelector],
  (collection, query) => flowRight(filterData(query))(collection.data)
);

const viewSelector: Function = createSelector(
  [currentUserSelector, usersSelector, querySelector, collectionSelector],
  (currentUser, users, query, collection) => ({
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
  search(),
  modal(),
  sync('users')
)
export default class RBACUsers extends Component {
  props: {
    onSearchChange: Function,
    query: string,
    usersModel: Array<*>,
    user: Object,
    openModal: Function,
    closeModal?: Function,
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
    roles: Array<string>
  ): Promise<*> => {
    await this.props.createUser(name, username, password, roles);

    this.props.closeModal();
  };

  handleUpdateUserClick: Function = async (
    name: string,
    username: string,
    roles: Array<string>
  ): Promise<*> => {
    await this.props.updateUser(name, username, roles);

    this.props.closeModal();
  };

  handleRemoveUserClick: Function = (username): void => {
    const handleConfirm: Function = (): void => {
      this.props.removeUser(username);
      this.props.closeModal();
    };

    this.props.openModal(
      <ConfirmDialog onClose={this.props.closeModal} onConfirm={handleConfirm}>
        Are you sure you want to delete the user <strong>{username}</strong>?
      </ConfirmDialog>
    );
  };

  render() {
    const { permissions } = this.props.user;
    const canEdit = hasPermission(
      permissions,
      ['USER-CONTROL', 'MODIFY-USER'],
      'or'
    );
    const canDelete = hasPermission(
      permissions,
      ['USER-CONTROL', 'DELETE-USER'],
      'or'
    );

    return (
      <div>
        <Toolbar marginBottom>
          {hasPermission(permissions, ['USER-CONTROL', 'ADD-USER'], 'or') && (
            <div className="pull-left">
              <Button
                text="Add user"
                iconName="plus"
                intent={Intent.PRIMARY}
                onClick={this.handleAddUserClick}
              />
            </div>
          )}

          <Search
            onSearchUpdate={this.props.onSearchChange}
            defaultValue={this.props.query}
            resource="rbacusers"
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
    );
  }
}
