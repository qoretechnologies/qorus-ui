/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import Alert from '../components/alert';
import Box from '../components/box';
import Flex from '../components/Flex';
import Headbar from '../components/Headbar';
import { Breadcrumbs, Crumb } from '../components/breadcrumbs';

/**
 * A high-order component that provides an easy access to
 * opening and closing a modal
 */
export default (
  prop: string,
  name: string,
  breadcrumbsTitle?: string
): Function => (Component: ReactClass<*>): ReactClass<*> => {
  const hasInterfaceAccess = ({ userData, noauth, ...rest }) => {
    const hasInterfaces: boolean =
      noauth || userData.has_default || userData[prop].length;

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
              You do not have access to any {name.toLowerCase()}. Please contact
              your administrator.
            </Alert>
          </Box>
        </Flex>
      );
    }

    return <Component {...rest} />;
  };

  return compose(
    connect(state => ({
      userData: state.api.currentUser.data,
      noauth: state.api.info.data.noauth,
    }))
  )(hasInterfaceAccess);
};
