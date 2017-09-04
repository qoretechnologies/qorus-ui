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
    <h3 className="main-error-text"><Icon icon="warning" /> Oooops... </h3>
    <div className="error-wrapper">
      The Qorus server cannot be reached at the moment. We will reload the page once the server
      becomes available again. <a href={next}>Reload manually</a>
    </div>
  </div>
);

export default compose(
  mapProps(({ location: { query: { next } } }: Props) => ({
    next: !next || next === '' || next === '/error' ? '/' : next,
  })),
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

        const { next } = this.props;

        if (res.status !== 500) {
          window.location.href = !next || next === '' || next === '/error' ? '/' : next;
        }
      }, 30000);
    },
  }),
)(ErrorView);
