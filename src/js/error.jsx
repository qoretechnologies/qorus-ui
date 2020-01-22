// @flow
import React from 'react';
import Icon from './components/icon';
import lifecycle from 'recompose/lifecycle';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';

import { fetchResponse } from './store/api/utils';
import settings from './settings';

type Props = {
  next: string,
  location: Object,
};

const ErrorView: Function = ({ next }: Props): React.Element<any> => (
  <div className="center-wrapper default-wrapper">
    <h3 className="main-error-text">
      <Icon icon="warning" /> Oooops...{' '}
    </h3>
    <div className="error-wrapper">
      The Qorus server cannot be reached at the moment. We will reload the page
      once the server becomes available again.{' '}
      <a href={next}>Reload manually</a>
    </div>
  </div>
);

export default compose(
  mapProps(({ location: { query: { next } } }: Props) => ({
    next: !next || next === '' || next === '/error' ? '/' : next,
  })),
  lifecycle({
    componentDidMount() {
      const { next } = this.props;

      async function checkServer() {
        const res = await fetchResponse(
          'GET',
          `${settings.REST_BASE_URL}/public/info`,
          null,
          false,
          false
        );

        if (res.status === 200) {
          window.location.href =
            !next || next === '' || next === '/error' ? '/' : next;
        }
      }
      checkServer();
      setInterval(checkServer, 30000);
    },
  })
)(ErrorView);
