// @flow
import React from 'react';
import Icon from './components/icon';
import lifecycle from 'recompose/lifecycle';
import compose from 'recompose/compose';

import { fetchResponse } from './store/api/utils';
import settings from './settings';

const ErrorView: Function = (): React.Element<any> => (
  <div className="center-wrapper default-wrapper">
    <h3 className="main-error-text"><Icon icon="warning" /> Oooops... </h3>
    <div className="error-wrapper">
      The Qorus server cannot be reached at the moment. We will reload the page once the server
      becomes available again.
    </div>
  </div>
);

export default compose(
  lifecycle({
    componentDidMount() {
      setInterval(async () => {
        const res = await fetchResponse(
          'GET',
          `${settings.REST_BASE_URL}/public/info`,
          null,
          false,
          false
        );

        const { next } = this.props.location.query;

        if (res.status !== 500) {
          window.location.href = !next || next === '' || next === '/error' ? '/' : next;
        }
      }, 5000);
    },
  }),
)(ErrorView);
