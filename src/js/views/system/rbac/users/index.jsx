/* @flow */
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import flowRight from 'lodash/flowRight';
import { Button, Intent } from '@blueprintjs/core';

import sync from '../../../../hocomponents/sync';
import modal from '../../../../hocomponents/modal';
import withDispatch from '../../../../hocomponents/withDispatch';
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
  props.location.query.search;
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
    }
  ),
  withDispatch(),
  modal(),
  sync('users')
)
export default class RBACUsers extends Component {
  props: {
    usersModel: Array<*>,
    user: Object,
    openModal: Function,
    closeModal: Function,
    optimisticDispatch: Function,
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
    await this.props.optimisticDispatch(
      actions.users.create,
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
    roles: Array<string>
  ): Promise<*> => {
    await this.props.optimisticDispatch(
      actions.users.update,
      name,
      username,
      roles
    );

    this.props.closeModal();
  };

  handleRemoveUserClick: Function = (username): void => {
    const handleConfirm: Function = (): void => {
      this.props.optimisticDispatch(actions.users.remove, username);
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

    const canAdd = hasPermission(
      permissions,
      ['USER-CONTROL', 'ADD-USER'],
      'or'
    );

    return (
      <Table
        collection={this.props.usersModel}
        canAdd={canAdd}
        canEdit={canEdit}
        canDelete={canDelete}
        onAddUserClick={this.handleAddUserClick}
        onDeleteClick={this.handleRemoveUserClick}
        onEditClick={this.handleEditUserClick}
      />
    );
  }
}
