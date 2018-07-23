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
const rolesSelector: Function = (state: Object): Object => state.api.roles;
const querySelector: Function = (state: Object, props: Object): ?string =>
  props.location.query.q;
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
      createRole: actions.roles.createRole,
      updateRole: actions.roles.updateRole,
      removeRole: actions.roles.removeRole,
    }
  ),
  search(),
  modal(),
  sync('roles', true, 'loadRoles')
)
export default class RBACRoles extends Component {
  props: {
    onSearchChange: Function,
    query: string,
    rolesModel: Array<*>,
    openModal: Function,
    closeModal: Function,
    createRole: Function,
    updateRole: Function,
    removeRole: Function,
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
    await this.props.createRole(role, desc, perms, groups);

    this.props.closeModal();
  };

  handleUpdateRoleClick: Function = async (
    role: string,
    desc: string,
    perms: Array<string>,
    groups: Array<string>
  ): Promise<*> => {
    await this.props.updateRole(role, desc, perms, groups);

    this.props.closeModal();
  };

  handleRemoveRoleClick: Function = (role): void => {
    const handleConfirm: Function = (): void => {
      this.props.removeRole(role);
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
      <div>
        <Toolbar marginBottom>
          {hasPermission(permissions, ['USER-CONTROL', 'ADD-ROLE'], 'or') && (
            <div className="pull-left">
              <Button
                text="Add role"
                icon="plus"
                intent={Intent.PRIMARY}
                onClick={this.handleAddRoleClick}
              />
            </div>
          )}
          <Search
            onSearchUpdate={this.props.onSearchChange}
            defaultValue={this.props.query}
            resource="rbacroles"
          />
        </Toolbar>
        <Table
          collection={this.props.rolesModel}
          onDeleteClick={this.handleRemoveRoleClick}
          onEditClick={this.handleEditRoleClick}
          onCloneClick={this.handleCloneRoleClick}
          canEdit={canEdit}
          canDelete={canDelete}
          canCreate={canCreate}
        />
      </div>
    );
  }
}
