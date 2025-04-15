/* @flow */
import find from 'lodash/find';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { createSelector } from 'reselect';
import Alert from '../../../../components/alert';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { ReqoreModal, ReqoreMultiSelect } from '@qoretechnologies/reqore';
import { Item as DropItem } from '../../../../components/dropdown';
import sync from '../../../../hocomponents/sync';
import actions from '../../../../store/api/actions';

// @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
const rolesSelector: Function = (state: any): any => state.api.roles;

// @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
const viewSelector: Function = createSelector([rolesSelector], (roles) => ({
  roles,
  rolesModel: roles.data,
}));

@compose(
  connect(viewSelector, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'roles' does not exist on type '{}'.
    load: actions.roles.fetch,
  }),
  sync('roles')
)
export default class AddUserModal extends Component {
  props: {
    rolesModel?: Array<Object>;
    users: Array<Object>;
    onClose: Function;
    onSave: Function;
    model?: any;
    title: string;
    rbacExternal: any;
  } = this.props;

  state: {
    roles: Array<string>;
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    error: string;
  } = {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'roles' does not exist on type 'Object'.
    roles: this.props.model ? this.props.model.roles : [],
    error: null,
  };

  handleRoleSelect: Function = (roles): void => {
    this.setState({
      roles,
    });
  };

  handleSaveClick: Function = (): void => {
    const { name, username, password, passwordConf } = this.refs;

    // @ts-ignore ts-migrate(2339) FIXME: Property 'passOnly' does not exist on type '{ role... Remove this comment to see the full error message
    if (!this.props.passOnly && (name.value === '' || username.value === '')) {
      this.setState({
        error: 'Please fill all fields marked with *',
      });
      // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'ReactInst... Remove this comment to see the full error message
    } else if (password.value !== passwordConf.value) {
      this.setState({
        error: 'Passwords do not match!',
      });
    } else {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'ReactInst... Remove this comment to see the full error message
      const pass = password.value === '' ? undefined : password.value;

      // @ts-ignore ts-migrate(2339) FIXME: Property 'passOnly' does not exist on type '{ role... Remove this comment to see the full error message
      if (this.props.passOnly) {
        this.props.onSave(pass);
      } else {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'ReactInst... Remove this comment to see the full error message
        this.props.onSave(name.value, username.value, pass, this.state.roles);
      }
    }
  };

  handleCreateClick: Function = (): void => {
    const { name, username, password, passwordConf } = this.refs;

    if (
      // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'ReactInst... Remove this comment to see the full error message
      name.value === '' ||
      // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'ReactInst... Remove this comment to see the full error message
      username.value === '' ||
      // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'ReactInst... Remove this comment to see the full error message
      password.value === '' ||
      // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'ReactInst... Remove this comment to see the full error message
      passwordConf.value === ''
    ) {
      this.setState({
        error: 'Please fill all fields marked with *',
      });
      // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'ReactInst... Remove this comment to see the full error message
    } else if (password.value !== passwordConf.value) {
      this.setState({
        error: 'Password and confirmation do not match',
      });
      // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'ReactInst... Remove this comment to see the full error message
    } else if (find(this.props.users, { username: username.value })) {
      this.setState({
        error: 'User with this username already exists',
      });
    } else {
      this.props.onSave(
        // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'ReactInst... Remove this comment to see the full error message
        name.value,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'ReactInst... Remove this comment to see the full error message
        username.value,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'ReactInst... Remove this comment to see the full error message
        password.value,
        this.state.roles
      );
    }
  };

  // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
  handleFormSubmit: Function = (event: EventHandler): void => {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'passOnly' does not exist on type '{ role... Remove this comment to see the full error message
    if (this.props.model || this.props.passOnly) {
      this.handleSaveClick();
    } else {
      this.handleCreateClick();
    }
  };

  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  renderRoles: Function = (): Array<React.Element<DropItem>> =>
    this.props.rolesModel
      ? this.props.rolesModel.map((role) => (
          // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
          <DropItem key={role.role} title={role.role} />
        ))
      : null;

  handleClose = () => {};

  render() {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'passOnly' does not exist on type '{ role... Remove this comment to see the full error message
    const { model, onClose, rbacExternal, passOnly } = this.props;

    return (
      // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
      <ReqoreModal
        label={this.props.title}
        isOpen
        bottomActions={[
          {
            label: 'Cancel',
            onClick: onClose,
            position: 'left',
            icon: 'CloseLine',
          },
          {
            label: 'Submit',
            onClick: this.handleFormSubmit,
            intent: 'success',
            position: 'right',
            icon: 'CheckLine',
          },
        ]}
        width="500px"
      >
        {this.state.error && <Alert bsStyle="danger">{this.state.error}</Alert>}
        {rbacExternal && (
          <Alert bsStyle="warning">
            Only users stored in Qorus system DB are manageable in this area. External RBAC
            providers are: {rbacExternal}.
          </Alert>
        )}
        {!passOnly && (
          <>
            <div className="form-group">
              <label htmlFor="username" className="col-sm-4 control-label">
                Username *
              </label>
              <div className="col-sm-6">
                <input
                  // @ts-ignore ts-migrate(2322) FIXME: Type 'Object' is not assignable to type 'boolean'.
                  readOnly={model}
                  ref="username"
                  type="text"
                  className="form-control"
                  id="username"
                  // @ts-ignore ts-migrate(2339) FIXME: Property 'username' does not exist on type 'Object... Remove this comment to see the full error message
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
                  // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                  defaultValue={model ? model.name : ''}
                />
              </div>
            </div>
          </>
        )}
        <div className="form-group">
          <label htmlFor="password" className="col-sm-4 control-label">
            {passOnly || model ? 'New password' : 'Password *'}
          </label>
          <div className="col-sm-6">
            <input ref="password" type="password" className="form-control" id="password" />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="password-confirm" className="col-sm-4 control-label">
            {passOnly || model ? 'Confirm new password' : 'Confirm password *'}
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
        {!passOnly && (
          <div className="form-group">
            <label htmlFor="roles" className="col-sm-4 control-label">
              {' '}
              Roles{' '}
            </label>
            <div className="col-sm-6">
              <ReqoreMultiSelect
                onValueChange={(roles) => {
                  console.log(roles);
                  this.setState({
                    roles,
                  });
                }}
                canRemoveItems
                value={this.state.roles}
                items={this.props.rolesModel?.map(({ role }) => ({
                  label: role,
                  value: role,
                }))}
                flat={false}
              />
            </div>
          </div>
        )}
      </ReqoreModal>
    );
  }
}
