/* @flow */
import flowRight from 'lodash/flowRight';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { createSelector } from 'reselect';
import ConfirmDialog from '../../../../components/confirm_dialog';
import { findBy } from '../../../../helpers/search';
import { hasPermission } from '../../../../helpers/user';
import modal from '../../../../hocomponents/modal';
import sync from '../../../../hocomponents/sync';
import withDispatch from '../../../../hocomponents/withDispatch';
import actions from '../../../../store/api/actions';
import Modal from './modal';
import Table from './table';

const currentUserSelector: Function = (state: any): any =>
  // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
  state.api.currentUser;
const optionsSelector: Function = (state: any): any =>
  // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
  state.api.systemOptions;
// @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
const usersSelector: Function = (state: any): any => state.api.users;
// @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
const querySelector: Function = (state: any, props: any): string =>
  // @ts-ignore ts-migrate(2339) FIXME: Property 'location' does not exist on type 'Object... Remove this comment to see the full error message
  props.location.query.search;
// @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
const filterData: Function =
  (query: string): Function =>
  (
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    collection: Array<any>
  ) =>
    findBy(['name', 'username'], query, collection);

const collectionSelector: Function = createSelector(
  // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
  [usersSelector, querySelector],
  (collection, query) => flowRight(filterData(query))(collection.data)
);

const viewSelector: Function = createSelector(
  // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
  [currentUserSelector, usersSelector, querySelector, collectionSelector, optionsSelector],
  (currentUser, users, query, collection, options) => ({
    user: currentUser.data,
    options: options.data,
    users,
    query,
    usersModel: collection,
  })
);

@compose(
  connect(viewSelector, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'users' does not exist on type '{}'.
    load: actions.users.fetch,
  }),
  withDispatch(),
  modal(),
  sync('users')
)
export default class RBACUsers extends Component {
  props: {
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    usersModel: Array<any>;
    user: any;
    openModal: Function;
    closeModal: Function;
    optimisticDispatch: Function;
    options: Array<Object>;
  } = this.props;

  isRbacExternal: Function = () => {
    const { options } = this.props;
    const rbacExternal: any = options.find(
      // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
      (option: any): boolean => option.name === 'rbac-external'
    );

    return rbacExternal?.value;
  };

  handleAddUserClick: Function = (): void => {
    this.props.openModal(
      <Modal
        onClose={this.props.closeModal}
        onSave={this.handleCreateUserClick}
        users={this.props.usersModel}
        title="Add user"
        rbacExternal={this.isRbacExternal()}
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
        rbacExternal={this.isRbacExternal()}
      />
    );
  };

  handleCreateUserClick: Function = async (
    name: string,
    username: string,
    password: string,
    roles: Array<string>
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  ): Promise<any> => {
    await this.props.optimisticDispatch(
      // @ts-ignore ts-migrate(2339) FIXME: Property 'users' does not exist on type '{}'.
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
    pass: string,
    roles: Array<string>
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  ): Promise<any> => {
    await this.props.optimisticDispatch(
      // @ts-ignore ts-migrate(2339) FIXME: Property 'users' does not exist on type '{}'.
      actions.users.update,
      name,
      username,
      pass,
      roles
    );

    this.props.closeModal();
  };

  /* handleResetPasswordClick = (username) => {
    this.props.openModal(
      <Reset
    )
  } */

  handleRemoveUserClick: Function = (username): void => {
    const handleConfirm: Function = (): void => {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'users' does not exist on type '{}'.
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
    // @ts-ignore ts-migrate(2339) FIXME: Property 'permissions' does not exist on type 'Obj... Remove this comment to see the full error message
    const { permissions } = this.props.user;
    const canEdit = hasPermission(permissions, ['USER-CONTROL', 'MODIFY-USER'], 'or');
    const canDelete = hasPermission(permissions, ['USER-CONTROL', 'DELETE-USER'], 'or');

    const canAdd = hasPermission(permissions, ['USER-CONTROL', 'ADD-USER'], 'or');

    return (
      <Table
        users={this.props.usersModel}
        canAdd={canAdd}
        canEdit={canEdit}
        canDelete={canDelete}
        onAddUserClick={this.handleAddUserClick}
        onDeleteClick={this.handleRemoveUserClick}
        onEditClick={this.handleEditUserClick}
        rbacExternal={this.isRbacExternal()}
      />
    );
  }
}
