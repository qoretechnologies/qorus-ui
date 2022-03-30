import React from 'react';
import TreeView from './tree';
import pure from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import mapProps from 'recompose/mapProps';
import withHandlers from 'recompose/withHandlers';

import actions from '../../../store/api/actions';
import settings from '../../../settings';
import { hasPermission } from '../../../helpers/user';
import Alert from '../../../components/alert';
import Icon from '../../../components/icon';

type Props = {
  order: Object,
  perms: Array<string>,
  isSecure: boolean,
  hasPerms: boolean,
  handleEditClick: Function,
};

const SensitiveView: Function = ({
  order,
  isSecure,
  hasPerms,
  handleEditClick,
}: Props) => {
  if (isSecure && hasPerms) {
    return (
      <TreeView
        data="sensitive_data"
        order={order}
        onEditClick={handleEditClick}
        editableKeys
      />
    );
  }

  if (!isSecure && !hasPerms) {
    return (
      <Alert bsStyle="danger">
        Your connection is not secure and you do not have the needed permission
        to view this.
      </Alert>
    );
  } else if (!isSecure) {
    return <Alert bsStyle="danger">Your connection is not secure.</Alert>;
  }

  return (
    <Alert bsStyle="danger">
      You do not have the needed permission to view this.
    </Alert>
  );
};

export default compose(
  connect(
    (state: Object): Object => ({
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      perms: state.api.currentUser.data.permissions,
    }),
    {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'orders' does not exist on type '{}'.
      fetchYamlData: actions.orders.fetchYamlData,
    }
  ),
  mapProps(
    ({ perms, ...rest }: Props): Props => ({
      isSecure: settings.PROTOCOL === 'https:',
      hasPerms: hasPermission(
        perms,
        ['READ-SENSITIVE-DATA', 'SENSITIVE-DATA-CONTROL'],
        'or'
      ),
      perms,
      ...rest,
    })
  ),
  withHandlers({
    handleEditClick: ({ fetchYamlData, order }): Function => (): void => {
      fetchYamlData('Sensitive', order.id);
    },
  }),
  pure(['order', 'perms', 'isSecure', 'hasPerms'])
)(SensitiveView);
