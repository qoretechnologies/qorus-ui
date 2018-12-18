/* @flow */
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import flowRight from 'lodash/flowRight';

import sync from '../../../../hocomponents/sync';
import modal from '../../../../hocomponents/modal';
import withDispatch from '../../../../hocomponents/withDispatch';
import ConfirmDialog from '../../../../components/confirm_dialog';
import { findBy } from '../../../../helpers/search';
import { hasPermission } from '../../../../helpers/user';
import Modal from './modal';
import Table from './table';

import actions from '../../../../store/api/actions';

const currentUserSelector: Function = (state: Object): Object =>
  state.api.currentUser;
const rolesSelector: Function = (state: Object): Object => state.api.roles;
const querySelector: Function = (state: Object, props: Object): ?string =>
  props.location.query.search;
const filterData: Function = (query: ?string): Function => (
  collection: Array<*>
) => findBy(['role', 'provider', 'desc'], query, collection);

const collectionSelector: Function = createSelector(
  [rolesSelector, querySelector],
  (collection, query) => flowRight(filterData(query))(collection.data)
);

const viewSelector: Function = createSelector(
  [currentUserSelector, rolesSelector, querySelector, collectionSelector],
  (currentUser, roles, query, collection) => ({
    user: currentUser.data,
    roles,
    query,
    rolesModel: collection,
  })
);

@compose(
  connect(
    viewSelector,
    {
      loadRoles: actions.roles.fetch,
    }
  ),
  withDispatch(),
  modal(),
  sync('roles', true, 'loadRoles')
)
export default class RBACRoles extends Component {
  props: {
    rolesModel: Array<*>,
    openModal: Function,
    closeModal: Function,
    optimisticDispatch: Function,
    user: Object,
  };

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
  ): Promise<*> => {
    await this.props.optimisticDispatch(
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
  ): Promise<*> => {
    await this.props.optimisticDispatch(
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
    const { permissions } = this.props.user;
    const canEdit = hasPermission(
      permissions,
      ['USER-CONTROL', 'MODIFY-ROLE'],
      'or'
    );
    const canDelete = hasPermission(
      permissions,
      ['USER-CONTROL', 'DELETE-ROLE'],
      'or'
    );
    const canCreate = hasPermission(
      permissions,
      ['USER-CONTROL', 'ADD-ROLE'],
      'or'
    );

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
