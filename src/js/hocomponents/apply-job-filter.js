import { PropTypes } from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';
import withHandlers from 'recompose/withHandlers';

import { goTo } from '../helpers/router';

export default (name: string, path: string) => compose(
  getContext({
    router: PropTypes.object,
    params: PropTypes.object,
  }),
  withHandlers({
    onApplyJobFilter: props => filter => {
      const { router, location, params } = props;
      goTo(router, name, path, params, {}, { ...location.query, filter });
    },
  }),
  mapProps(
    props => ({ ...props, jobFilter: props.location.query.filter })
  )
);
