/* @flow */
import find from 'lodash/find';
import flowRight from 'lodash/flowRight';
import includes from 'lodash/includes';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';
import { createSelector } from 'reselect';
import Alert from '../../../../components/alert';
import Badge from '../../../../components/badge';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Control as Button, Controls } from '../../../../components/controls';
import Dropdown, {
  Control as DropControl,
  Item as DropItem,
} from '../../../../components/dropdown';
import Modal from '../../../../components/modal';
import patchFuncArgs from '../../../../hocomponents/patchFuncArgs';
import sync from '../../../../hocomponents/sync';
import actions from '../../../../store/api/actions';

// @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
const usersSelector: Function = (state: Object): Object => state.api.users;
const permissionsSelector: Function = (state: Object): Object =>
  // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
  state.api.perms;
// @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
const groupsSelector: Function = (state: Object): Object => state.api.groups;
// @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
const roleNameSelector: Function = (state: Object, props: Object): string => {
  // @ts-ignore ts-migrate(2339) FIXME: Property 'model' does not exist on type 'Object'.
  if (!props.model) return null;

  // @ts-ignore ts-migrate(2339) FIXME: Property 'model' does not exist on type 'Object'.
  return props.model.role;
};

const filterUsers: Function =
  (role): Function =>
  (
    data: Array<Object>
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  ): Array<Object> => {
    if (!role) return null;

    // @ts-ignore ts-migrate(2339) FIXME: Property 'roles' does not exist on type 'Object'.
    return data.filter((user) => includes(user.roles, role));
  };

const usersCollection: Function = createSelector(
  // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
  [usersSelector, roleNameSelector],
  (users, role) => flowRight(filterUsers(role))(users.data)
);

const viewSelector: Function = createSelector(
  // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
  [usersSelector, usersCollection, permissionsSelector, groupsSelector],
  (users, usersModel, permissions, groups) => ({
    permissions,
    groups,
    users,
    usersModel,
    permsModel: permissions.data,
    groupsModel: groups.data,
  })
);

@compose(
  connect(viewSelector, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'users' does not exist on type '{}'.
    loadUsers: actions.users.fetch,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'perms' does not exist on type '{}'.
    loadPerms: actions.perms.fetch,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'groups' does not exist on type '{}'.
    loadGroups: actions.groups.fetch,
  }),
  sync('users', true, 'loadUsers'),
  sync('permissions', true, 'loadPerms'),
  defaultProps({
    fetchParams: { no_synthetic: true },
  }),
  patchFuncArgs('loadGroups', ['fetchParams']),
  sync('groups', true, 'loadGroups')
)
export default class AddRoleModal extends Component {
  props: {
    permsModel?: Array<Object>;
    groupsModel?: Array<Object>;
    roles?: Array<Object>;
    onClose: Function;
    onSave: Function;
    model?: Object;
    usersModel?: Array<Object>;
    title: string;
  } = this.props;

  state: {
    perms: Array<string>;
    groups: Array<string>;
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    error: string;
  } = {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'permissions' does not exist on type 'Obj... Remove this comment to see the full error message
    perms: this.props.model ? this.props.model.permissions : [],
    // @ts-ignore ts-migrate(2339) FIXME: Property 'groups' does not exist on type 'Object'.
    groups: this.props.model ? this.props.model.groups : [],
    error: null,
  };

  handlePermsSelect: Function = (perms): void => {
    this.setState({
      perms,
    });
  };

  handleGroupsSelect: Function = (groups): void => {
    this.setState({
      groups,
    });
  };

  handleSaveClick: Function = (): void => {
    const { name, desc } = this.refs;

    // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'ReactInst... Remove this comment to see the full error message
    if (name.value === '' || desc.value === '') {
      this.setState({
        error: 'Please fill all fields marked with *',
      });
    } else if (
      !this.props.model &&
      // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'ReactInst... Remove this comment to see the full error message
      find(this.props.roles, { role: name.value })
    ) {
      this.setState({
        error: 'A role with this name already exists.',
      });
    } else {
      this.props.onSave(
        // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'ReactInst... Remove this comment to see the full error message
        name.value,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'ReactInst... Remove this comment to see the full error message
        desc.value,
        this.state.perms,
        this.state.groups
      );
    }
  };

  // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
  handleFormSubmit: Function = (event: EventHandler): void => {
    event.preventDefault();

    this.handleSaveClick();
  };

  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  renderPerms: Function = (): Array<React.Element<DropItem>> =>
    this.props.permsModel
      ? // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
        this.props.permsModel.map((p) => <DropItem key={p.name} title={p.name} />)
      : null;

  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  renderGroups: Function = (): Array<React.Element<DropItem>> =>
    this.props.groupsModel
      ? this.props.groupsModel.map((g) => (
          // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
          <DropItem key={g.name} title={g.name} />
        ))
      : null;

  render() {
    const { model, onClose, usersModel } = this.props;

    return (
      // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
      <form className="form-horizontal" onSubmit={this.handleFormSubmit}>
        <Modal hasFooter>
          <Modal.Header titleId="addUserModal" onClose={onClose}>
            {this.props.title}
          </Modal.Header>
          <Modal.Body>
            {this.state.error && <Alert bsStyle="danger">{this.state.error}</Alert>}
            <div className="form-group">
              <label htmlFor="name" className="col-sm-4 control-label">
                Role name *
              </label>
              <div className="col-sm-6">
                <input
                  // @ts-ignore ts-migrate(2322) FIXME: Type 'Object' is not assignable to type 'boolean'.
                  readOnly={model}
                  ref="name"
                  type="text"
                  className="form-control"
                  id="name"
                  // @ts-ignore ts-migrate(2339) FIXME: Property 'role' does not exist on type 'Object'.
                  defaultValue={model ? model.role : ''}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="desc" className="col-sm-4 control-label">
                Description *
              </label>
              <div className="col-sm-6">
                <textarea
                  ref="desc"
                  className="form-control"
                  id="desc"
                  // @ts-ignore ts-migrate(2339) FIXME: Property 'desc' does not exist on type 'Object'.
                  defaultValue={model ? model.desc : ''}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="perms" className="col-sm-4 control-label">
                {' '}
                Permissions{' '}
              </label>
              <div className="col-sm-6">
                <Dropdown
                  id="perms"
                  multi
                  // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
                  onSelect={this.handlePermsSelect}
                  // @ts-ignore ts-migrate(2339) FIXME: Property 'permissions' does not exist on type '{ p... Remove this comment to see the full error message
                  selected={model ? this.state.permissions : null}
                >
                  {/* @ts-expect-error ts-migrate(2739) FIXME: Type '{ children: string; }' is missing the follow... Remove this comment to see the full error message */}
                  <DropControl> Select permissions </DropControl>
                  {this.renderPerms()}
                </Dropdown>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="groups" className="col-sm-4 control-label">
                {' '}
                Groups{' '}
              </label>
              <div className="col-sm-6">
                <Dropdown
                  id="groups"
                  multi
                  // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
                  onSelect={this.handleGroupsSelect}
                  selected={model ? this.state.groups : null}
                >
                  {/* @ts-expect-error ts-migrate(2739) FIXME: Type '{ children: string; }' is missing the follow... Remove this comment to see the full error message */}
                  <DropControl> Select groups </DropControl>
                  {this.renderGroups()}
                </Dropdown>
              </div>
            </div>
            {usersModel && usersModel.length > 0 && (
              <div className="form-group">
                <label className="col-sm-4 control-label"> Users with role </label>
                <div className="col-sm-6">
                  {usersModel.map((u, index) => (
                    // @ts-ignore ts-migrate(2339) FIXME: Property 'username' does not exist on type 'Object... Remove this comment to see the full error message
                    <Badge key={index} val={u.username} label="info" />
                  ))}
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Controls noControls grouped>
              <Button label="Cancel" big btnStyle="default" action={onClose} type="button" />
              <Button label="Save" big btnStyle="success" type="submit" />
            </Controls>
          </Modal.Footer>
        </Modal>
      </form>
    );
  }
}
