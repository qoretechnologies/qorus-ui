import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import Alert from '../../../components/alert';
import { hasPermission } from '../../../helpers/user';
import settings from '../../../settings';
import actions from '../../../store/api/actions';
import TreeView from './tree';

type Props = {
  order: any;
  perms: Array<string>;
  isSecure: boolean;
  hasPerms: boolean;
  handleEditClick: Function;
};

const SensitiveView: Function = ({ order, isSecure, hasPerms, handleEditClick }: Props) => {
  if (isSecure && hasPerms) {
    return (
      <TreeView data="sensitive_data" order={order} onEditClick={handleEditClick} editableKeys />
    );
  }

  if (!isSecure && !hasPerms) {
    return (
      <Alert bsStyle="danger">
        Your connection is not secure and you do not have the needed permission to view this.
      </Alert>
    );
  } else if (!isSecure) {
    return <Alert bsStyle="danger">Your connection is not secure.</Alert>;
  }

  return <Alert bsStyle="danger">You do not have the needed permission to view this.</Alert>;
};

export default compose(
  connect(
    (state: any): any => ({
      // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      perms: state.api.currentUser.data.permissions,
    }),
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'orders' does not exist on type '{}'.
      fetchYamlData: actions.orders.fetchYamlData,
    }
  ),
  mapProps(
    ({ perms, ...rest }: Props): Props => ({
      isSecure: settings.PROTOCOL === 'https:',
      hasPerms: hasPermission(perms, ['READ-SENSITIVE-DATA', 'SENSITIVE-DATA-CONTROL'], 'or'),
      perms,
      ...rest,
    })
  ),
  withHandlers({
    handleEditClick:
      ({ fetchYamlData, order }): Function =>
      (): void => {
        fetchYamlData('Sensitive', order.id);
      },
  }),
  pure(['order', 'perms', 'isSecure', 'hasPerms'])
)(SensitiveView);
