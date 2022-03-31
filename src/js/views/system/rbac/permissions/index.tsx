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
const permsSelector: Function = (state: any): any => state.api.perms;
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
    findBy(['type', 'name', 'desc'], query, collection);

const collectionSelector: Function = createSelector(
  // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
  [permsSelector, querySelector],
  (collection, query) => flowRight(filterData(query))(collection.data)
);

const viewSelector: Function = createSelector(
  // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
  [currentUserSelector, permsSelector, querySelector, collectionSelector],
  (currentUser, perms, query, collection) => ({
    user: currentUser.data,
    perms,
    query,
    permsModel: collection,
  })
);

@compose(
  connect(viewSelector, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'perms' does not exist on type '{}'.
    load: actions.perms.fetch,
  }),
  withDispatch(),
  modal(),
  sync('perms')
)
export default class RBACPerms extends Component {
  props: {
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    permsModel: Array<any>;
    openModal: Function;
    closeModal: Function;
    optimisticDispatch: Function;
    user: any;
  } = this.props;

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
    desc: string
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  ): Promise<any> => {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'perms' does not exist on type '{}'.
    await this.props.optimisticDispatch(actions.perms.createPerm, name, desc);

    this.props.closeModal();
  };

  handleUpdatePermClick: Function = async (
    name: string,
    desc: string
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  ): Promise<any> => {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'perms' does not exist on type '{}'.
    await this.props.optimisticDispatch(actions.perms.updatePerm, name, desc);

    this.props.closeModal();
  };

  handleRemovePermClick: Function = (name): void => {
    const handleConfirm: Function = (): void => {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'perms' does not exist on type '{}'.
      this.props.optimisticDispatch(actions.perms.removePerm, name);
      this.props.closeModal();
    };

    this.props.openModal(
      <ConfirmDialog onClose={this.props.closeModal} onConfirm={handleConfirm}>
        Are you sure you want to delete the permission <strong>{name}</strong>?
      </ConfirmDialog>
    );
  };

  render() {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'permissions' does not exist on type 'Obj... Remove this comment to see the full error message
    const { permissions } = this.props.user;
    const canEdit = hasPermission(permissions, ['USER-CONTROL', 'MODIFY-PERMISSION'], 'or');
    const canDelete = hasPermission(permissions, ['USER-CONTROL', 'DELETE-PERMISSION'], 'or');

    const canAdd = hasPermission(permissions, ['USER-CONTROL', 'ADD-PERMISSION'], 'or');

    return (
      <Table
        perms={this.props.permsModel}
        onDeleteClick={this.handleRemovePermClick}
        onEditClick={this.handleEditPermClick}
        canEdit={canEdit}
        canDelete={canDelete}
        canAdd={canAdd}
        onAddPermClick={this.handleAddPermClick}
      />
    );
  }
}
