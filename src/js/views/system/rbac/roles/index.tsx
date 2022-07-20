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
// @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
const rolesSelector: Function = (state: any): any => state.api.roles;
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
    findBy(['role', 'provider', 'desc'], query, collection);

const collectionSelector: Function = createSelector(
  // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
  [rolesSelector, querySelector],
  (collection, query) => flowRight(filterData(query))(collection.data)
);

const viewSelector: Function = createSelector(
  // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
  [currentUserSelector, rolesSelector, querySelector, collectionSelector],
  (currentUser, roles, query, collection) => ({
    user: currentUser.data,
    roles,
    query,
    rolesModel: collection,
  })
);

@compose(
  connect(viewSelector, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'roles' does not exist on type '{}'.
    loadRoles: actions.roles.fetch,
  }),
  withDispatch(),
  modal(),
  sync('roles', true, 'loadRoles')
)
export default class RBACRoles extends Component {
  props: {
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    rolesModel: Array<any>;
    openModal: Function;
    closeModal: Function;
    optimisticDispatch: Function;
    user: any;
  } = this.props;

  handleAddRoleClick: Function = (): void => {
    this.props.openModal(
      <Modal
        onClose={this.props.closeModal}
        onSave={this.handleCreateRoleClick}
        roles={this.props.rolesModel}
        title="Add role"
      />
    );
  };

  handleEditRoleClick: Function = (model): void => {
    this.props.openModal(
      <Modal
        onClose={this.props.closeModal}
        onSave={this.handleUpdateRoleClick}
        roles={this.props.rolesModel}
        model={model}
        title="Edit role"
      />
    );
  };

  handleCloneRoleClick: Function = (model): void => {
    const newModel = Object.assign({}, model);

    newModel.role = `${model.role}_copy`;

    this.props.openModal(
      <Modal
        onClose={this.props.closeModal}
        onSave={this.handleCreateRoleClick}
        roles={this.props.rolesModel}
        model={newModel}
        title="Copy role"
      />
    );
  };

  handleCreateRoleClick: Function = async (
    role: string,
    desc: string,
    perms: Array<string>,
    groups: Array<string>
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  ): Promise<any> => {
    await this.props.optimisticDispatch(
      // @ts-ignore ts-migrate(2339) FIXME: Property 'roles' does not exist on type '{}'.
      actions.roles.create,
      role,
      desc,
      perms,
      groups
    );

    this.props.closeModal();
  };

  handleUpdateRoleClick: Function = async (
    role: string,
    desc: string,
    perms: Array<string>,
    groups: Array<string>
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  ): Promise<any> => {
    await this.props.optimisticDispatch(
      // @ts-ignore ts-migrate(2339) FIXME: Property 'roles' does not exist on type '{}'.
      actions.roles.update,
      role,
      desc,
      perms,
      groups
    );

    this.props.closeModal();
  };

  handleRemoveRoleClick: Function = (role): void => {
    const handleConfirm: Function = (): void => {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'roles' does not exist on type '{}'.
      this.props.optimisticDispatch(actions.roles.remove, role);
      this.props.closeModal();
    };

    this.props.openModal(
      <ConfirmDialog onClose={this.props.closeModal} onConfirm={handleConfirm}>
        Are you sure you want to delete the role <strong>{role}</strong>?
      </ConfirmDialog>
    );
  };

  render() {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'permissions' does not exist on type 'Obj... Remove this comment to see the full error message
    const { permissions } = this.props.user;
    const canEdit = hasPermission(permissions, ['USER-CONTROL', 'MODIFY-ROLE'], 'or');
    const canDelete = hasPermission(permissions, ['USER-CONTROL', 'DELETE-ROLE'], 'or');
    const canCreate = hasPermission(permissions, ['USER-CONTROL', 'ADD-ROLE'], 'or');

    return (
      <Table
        roles={this.props.rolesModel}
        onDeleteClick={this.handleRemoveRoleClick}
        onEditClick={this.handleEditRoleClick}
        onCloneClick={this.handleCloneRoleClick}
        onAddRoleClick={this.handleAddRoleClick}
        canEdit={canEdit}
        canDelete={canDelete}
        canCreate={canCreate}
      />
    );
  }
}
