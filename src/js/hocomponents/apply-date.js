/* @flow */
import { PropTypes } from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';

import { goTo } from '../helpers/router';

export default (name: string, path: string) => compose(
  getContext({
    router: PropTypes.object,
    params: PropTypes.object,
  }),
  withHandlers({
    onApplyDate: props => date => {
      const { router, location, params } = props;
      goTo(router, name, path, params, {}, { ...location.query, date });
    },
  }),
  mapProps(
    props => ({ ...props, date: props.location.query.date })
  )
);
