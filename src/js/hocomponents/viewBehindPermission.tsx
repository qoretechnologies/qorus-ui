/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Alert from '../components/alert';
import Box from '../components/box';
import { Breadcrumbs, Crumb } from '../components/breadcrumbs';
import Flex from '../components/Flex';
import Headbar from '../components/Headbar';
import { functionOrStringExp } from '../helpers/functions';
import { hasPermission } from '../helpers/user';

/**
 * A high-order component that provides an easy access to
 * opening and closing a modal
 */
export default (
    permissions: string[] | (() => string[]),
    cond: 'or' | 'and' = 'and',
    noHeadbar: boolean
    // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'ReactClass'.
  ): Function =>
  (Component) => {
    const ViewBehindPermissions = ({ userPermissions, ...rest }) => {
      const perms = functionOrStringExp(permissions, rest);
      const hasPerms: boolean = perms ? hasPermission(userPermissions, perms, cond) : true;

      if (!hasPerms) {
        return (
          <Flex>
            {!noHeadbar && (
              <Headbar>
                <Breadcrumbs>
                  <Crumb active>Access denied</Crumb>
                </Breadcrumbs>
              </Headbar>
            )}
            <Box top>
              <Alert bsStyle="warning">
                You do not have sufficient permissions to view this content. Please contact your
                administrator to grant you the following permissions: [{perms.join(', ')}].
              </Alert>
            </Box>
          </Flex>
        );
      }

      return <Component {...rest} />;
    };

    return compose(
      connect((state) => ({
        userPermissions: state.api.currentUser.data.permissions,
      }))
    )(ViewBehindPermissions);
  };
