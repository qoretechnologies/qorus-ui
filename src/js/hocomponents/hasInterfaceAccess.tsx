/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Alert from '../components/alert';
import Box from '../components/box';
import { Breadcrumbs, Crumb } from '../components/breadcrumbs';
import Flex from '../components/Flex';
import Headbar from '../components/Headbar';

/**
 * A high-order component that provides an easy access to
 * opening and closing a modal
 */
export default (
    prop: string,
    name: string,
    breadcrumbsTitle?: string
    // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'ReactClass'.
  ): Function =>
  (Component) => {
    const hasInterfaceAccess = ({ userData, info, ...rest }) => {
      const hasInterfaces: boolean = info.noauth || userData.has_default || userData[prop].length;

      if (!hasInterfaces) {
        return (
          <Flex>
            <Headbar>
              <Breadcrumbs>
                <Crumb active>{breadcrumbsTitle || name}</Crumb>
              </Breadcrumbs>
            </Headbar>

            <Box top>
              <Alert bsStyle="warning">
                You do not have access to any {name.toLowerCase()}. Please contact your
                administrator.
              </Alert>
            </Box>
          </Flex>
        );
      }

      return <Component {...rest} />;
    };

    return compose(
      connect((state) => ({
        info: state.api.info.data,
        userData: state.api.currentUser.data,
      }))
    )(hasInterfaceAccess);
  };
