/* @flow */
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import find from 'lodash/find';

import Modal from '../../../../components/modal';
import { Controls, Control as Button } from '../../../../components/controls';
import Dropdown, {
  Control as DropControl,
  Item as DropItem,
} from '../../../../components/dropdown';
import Alert from '../../../../components/alert';
import sync from '../../../../hocomponents/sync';
import actions from '../../../../store/api/actions';

const rolesSelector: Function = (state: Object): Object => state.api.roles;

const viewSelector: Function = createSelector(
  [rolesSelector],
  roles => ({
    roles,
    rolesModel: roles.data,
  })
);

@compose(
  connect(
    viewSelector,
    {
      load: actions.roles.fetch,
    }
  ),
  sync('roles')
)
export default class AddUserModal extends Component {
  props: {
    rolesModel?: Array<Object>,
    users: Array<Object>,
    onClose: Function,
    onSave: Function,
    model?: Object,
    title: string,
    rbacExternal: any,
  } = this.props;

  state: {
    roles: Array<string>,
    error: ?string,
  } = {
    roles: this.props.model ? this.props.model.roles : [],
    error: null,
  };

  handleRoleSelect: Function = (roles): void => {
    this.setState({
      roles,
    });
  };

  handleSaveClick: Function = (): void => {
    const { name, username } = this.refs;

    if (name.value === '' || username.value === '') {
      this.setState({
        error: 'Please fill all fields marked with *',
      });
    } else {
      this.props.onSave(name.value, username.value, this.state.roles);
    }
  };

  handleCreateClick: Function = (): void => {
    const { name, username, password, passwordConf } = this.refs;

    if (
      name.value === '' ||
      username.value === '' ||
      password.value === '' ||
      passwordConf.value === ''
    ) {
      this.setState({
        error: 'Please fill all fields marked with *',
      });
    } else if (password.value !== passwordConf.value) {
      this.setState({
        error: 'Password and confirmation do not match',
      });
    } else if (find(this.props.users, { username: username.value })) {
      this.setState({
        error: 'User with this username already exists',
      });
    } else {
      this.props.onSave(
        name.value,
        username.value,
        password.value,
        this.state.roles
      );
    }
  };

  handleFormSubmit: Function = (event: EventHandler): void => {
    event.preventDefault();

    if (this.props.model) {
      this.handleSaveClick();
    } else {
      this.handleCreateClick();
    }
  };

  renderRoles: Function = (): ?Array<React.Element<DropItem>> =>
    this.props.rolesModel
      ? this.props.rolesModel.map(role => (
          <DropItem key={role.role} title={role.role} />
        ))
      : null;

  render() {
    const { model, onClose, rbacExternal } = this.props;

    return (
      <form className="form-horizontal" onSubmit={this.handleFormSubmit}>
        <Modal hasFooter>
          <Modal.Header titleId="addUserModal" onClose={onClose}>
            {this.props.title}{' '}
          </Modal.Header>
          <Modal.Body>
            {this.state.error && (
              <Alert bsStyle="danger">{this.state.error}</Alert>
            )}
            {rbacExternal && (
              <Alert bsStyle="warning">
                Only users stored in Qorus system DB are manageable in this
                area. External RBAC providers are: {rbacExternal}.
              </Alert>
            )}
            <div className="form-group">
              <label htmlFor="username" className="col-sm-4 control-label">
                Username *
              </label>
              <div className="col-sm-6">
                <input
                  readOnly={model}
                  ref="username"
                  type="text"
                  className="form-control"
                  id="username"
                  defaultValue={model ? model.username : ''}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="name" className="col-sm-4 control-label">
                Full name *
              </label>
              <div className="col-sm-6">
                <input
                  ref="name"
                  type="text"
                  className="form-control"
                  id="name"
                  defaultValue={model ? model.name : ''}
                />
              </div>
            </div>
            {!model && (
              <div>
                <div className="form-group">
                  <label htmlFor="password" className="col-sm-4 control-label">
                    Password *
                  </label>
                  <div className="col-sm-6">
                    <input
                      ref="password"
                      type="password"
                      className="form-control"
                      id="password"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label
                    htmlFor="password-confirm"
                    className="col-sm-4 control-label"
                  >
                    Confirm password *
                  </label>
                  <div className="col-sm-6">
                    <input
                      ref="passwordConf"
                      type="password"
                      className="form-control"
                      id="password-confirm"
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="form-group">
              <label htmlFor="roles" className="col-sm-4 control-label">
                {' '}
                Roles{' '}
              </label>
              <div className="col-sm-6">
                <Dropdown
                  id="roles"
                  multi
                  onSelect={this.handleRoleSelect}
                  selected={model ? model.roles : null}
                >
                  <DropControl> Select roles </DropControl>
                  {this.renderRoles()}
                </Dropdown>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Controls noControls grouped>
              <Button
                label="Cancel"
                big
                btnStyle="default"
                action={onClose}
                type="button"
              />
              <Button label="Save" big btnStyle="success" type="submit" />
            </Controls>
          </Modal.Footer>
        </Modal>
      </form>
    );
  }
}
