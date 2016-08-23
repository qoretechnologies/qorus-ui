/* @flow */
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import includes from 'lodash/includes';
import flowRight from 'lodash/flowRight';
import find from 'lodash/find';

import Modal from '../../../../components/modal';
import { Controls, Control as Button } from '../../../../components/controls';
import Dropdown, {
  Control as DropControl,
  Item as DropItem,
} from '../../../../components/dropdown';
import Alert from '../../../../components/alert';
import Badge from '../../../../components/badge';
import actions from '../../../../store/api/actions';
import sync from '../../../../hocomponents/sync';

const usersSelector: Function = (state: Object): Object => state.api.users;
const permissionsSelector: Function = (state: Object): Object => state.api.perms;
const groupsSelector: Function = (state: Object): Object => state.api.groups;
const roleNameSelector: Function = (state: Object, props: Object): ?string => {
  if (!props.model) return null;

  return props.model.role;
};

const filterUsers: Function = (role): Function => (data: Array<Object>): ?Array<Object> => {
  if (!role) return null;

  return data.filter(user => (
    includes(user.roles, role)
  ));
};

const usersCollection: Function = createSelector(
  [
    usersSelector,
    roleNameSelector,
  ], (users, role) => flowRight(
    filterUsers(role),
  )(users.data)
);

const viewSelector: Function = createSelector(
  [
    usersSelector,
    usersCollection,
    permissionsSelector,
    groupsSelector,
  ], (users, usersModel, permissions, groups) => ({
    permissions,
    groups,
    users,
    usersModel,
    permsModel: permissions.data,
    groupsModel: groups.data,
  })
);

@compose(
  connect(
    viewSelector,
    {
      loadUsers: actions.users.fetch,
      loadPerms: actions.perms.fetch,
      loadGroups: actions.groups.fetch,
    }
  ),
  sync('users', true, 'loadUsers'),
  sync('permissions', true, 'loadPerms'),
  sync('groups', true, 'loadGroups'),
)
export default class AddRoleModal extends Component {
  props:{
    permsModel?: Array<Object>,
    groupsModel?: Array<Object>,
    roles?: Array<Object>,
    onClose: Function,
    onSave: Function,
    model?: Object,
    usersModel?: Array<Object>,
    title: string,
  };

  state: {
    perms: Array<string>,
    groups: Array<string>,
    error: ?string,
  } = {
    perms: this.props.model ? this.props.model.permissions : [],
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

    if (
      name.value === '' ||
      desc.value === ''
    ) {
      this.setState({
        error: 'Please fill all fields marked with *',
      });
    } else if (
      !this.props.model && find(this.props.roles, { role: name.value })
    ) {
      this.setState({
        error: 'A role with this name already exists.',
      });
    } else {
      this.props.onSave(
        name.value,
        desc.value,
        this.state.perms,
        this.state.groups,
      );
    }
  };

  renderPerms: Function = (): ?Array<React.Element<DropItem>> => (
    this.props.permsModel ? this.props.permsModel.map(p => (
      <DropItem
        key={p.name}
        title={p.name}
      />
    )) : null
  );

  renderGroups: Function = (): ?Array<React.Element<DropItem>> => (
    this.props.groupsModel ? this.props.groupsModel.map(g => (
      <DropItem
        key={g.name}
        title={g.name}
      />
    )) : null
  );

  render() {
    const { model, onClose, usersModel } = this.props;

    return (
      <Modal>
        <Modal.Header
          titleId="addUserModal"
          onClose={onClose}
        >{ this.props.title }</Modal.Header>
        <Modal.Body>
          { this.state.error && (
            <Alert bsStyle="danger">{ this.state.error }</Alert>
          )}
          <form className="form-horizontal">
            <div className="form-group">
              <label htmlFor="name" className="col-sm-4 control-label">Role name *</label>
              <div className="col-sm-6">
                <input
                  readOnly={model}
                  ref="name"
                  type="text"
                  className="form-control"
                  id="name"
                  defaultValue={model ? model.role : ''}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="desc" className="col-sm-4 control-label">Description *</label>
              <div className="col-sm-6">
                <textarea
                  ref="desc"
                  className="form-control"
                  id="desc"
                  defaultValue={model ? model.desc : ''}
                />
              </div>
            </div>
            <div className="form-group">
              <label
                htmlFor="perms"
                className="col-sm-4 control-label"
              > Permissions </label>
              <div className="col-sm-6">
                <Dropdown
                  id="perms"
                  multi
                  onSelect={this.handlePermsSelect}
                  selected={model ? model.permissions : null}
                >
                  <DropControl> Select permissions </DropControl>
                  { this.renderPerms() }
                </Dropdown>
              </div>
            </div>
            <div className="form-group">
              <label
                htmlFor="groups"
                className="col-sm-4 control-label"
              > Groups </label>
              <div className="col-sm-6">
                <Dropdown
                  id="groups"
                  multi
                  onSelect={this.handleGroupsSelect}
                  selected={model ? model.groups : null}
                >
                  <DropControl> Select groups </DropControl>
                  { this.renderGroups() }
                </Dropdown>
              </div>
            </div>
            { usersModel && usersModel.length > 0 && (
              <div className="form-group">
                <label
                  className="col-sm-4 control-label"
                > Users with role </label>
                <div className="col-sm-6">
                  { usersModel.map((u, index) => (
                    <Badge
                      key={index}
                      val={u.username}
                      label="info"
                    />
                  ))}
                </div>
              </div>
            )}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Controls noControls grouped>
            <Button
              label="Cancel"
              big
              btnStyle="default"
              action={onClose}
            />
            <Button
              label="Save"
              big
              btnStyle="success"
              action={this.handleSaveClick}
            />
          </Controls>
        </Modal.Footer>
      </Modal>
    );
  }
}
