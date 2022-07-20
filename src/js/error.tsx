// @flow
import React from 'react';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import mapProps from 'recompose/mapProps';
import Icon from './components/icon';
import settings from './settings';
import { fetchResponse } from './store/api/utils';

type Props = {
  next: string;
  location: any;
};

const ErrorView: Function = ({ next }: Props) => (
  <div className="center-wrapper default-wrapper">
    <h3 className="main-error-text">
      <Icon icon="warning" /> Oooops...{' '}
    </h3>
    <div className="error-wrapper">
      The Qorus server cannot be reached at the moment. We will reload the page once the server
      becomes available again. <a href={next}>Reload manually</a>
    </div>
  </div>
);

export default compose(
  mapProps(
    ({
      location: {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'query' does not exist on type 'Object'.
        query: { next },
      },
    }: Props) => ({
      next: !next || next === '' || next === '/error' ? '/' : next,
    })
  ),
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
          window.location.href = !next || next === '' || next === '/error' ? '/' : next;
        }
      }
      checkServer();
      setInterval(checkServer, 30000);
    },
  })
)(ErrorView);
