import React from 'react';
import TreeView from './tree';
import pure from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import mapProps from 'recompose/mapProps';
import settings from '../../../settings';
import { hasPermission } from '../../../helpers/user';
import Alert from '../../../components/alert';
import Icon from '../../../components/icon';

type Props = {
  order: Object,
  perms: Array<string>,
  isSecure: boolean,
  hasPerms: boolean,
}

const SensitiveView: Function = ({ order, isSecure, hasPerms }: Props) => {
  if (isSecure && hasPerms) {
    return (
      <TreeView
        data="sensitive_data"
        order={order}
      />
    );
  }

  if (!isSecure && !hasPerms) {
    return (
      <Alert bsStyle="danger">
        <Icon icon="warning" />
        {' '}
        Your connection is not secure and you do not have the needed permission to view this.
      </Alert>
    );
  } else if (!isSecure) {
    return (
      <Alert bsStyle="danger">
        <Icon icon="warning" />
        {' '}
        Your connection is not secure.
      </Alert>
    );
  }

  return (
    <Alert bsStyle="danger">
      <Icon icon="warning" />
      {' '}
      You do not have the needed permission to view this.
    </Alert>
  );
};

export default compose(
  connect(
    (state: Object): Object => ({
      perms: state.api.currentUser.data.permissions,
    })
  ),
  mapProps(({ perms, ...rest }: Props): Props => ({
    isSecure: settings.PROTOCOL === 'https:',
    hasPerms: hasPermission(perms, ['READ-SENSITIVE-DATA', 'SENSITIVE-DATA-CONTROL'], 'or'),
    perms,
    ...rest,
  })),
  pure(['order', 'perms', 'isSecure', 'hasPerms'])
)(SensitiveView);
