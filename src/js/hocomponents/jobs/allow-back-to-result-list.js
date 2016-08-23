import { PropTypes } from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';
import { goTo } from '../../helpers/router';

export default compose(
  getContext({
    router: PropTypes.object,
    params: PropTypes.object,
  }),
  mapProps(
    props => ({
      ...props,
      backToResultList: () => {
        const { router, location, params } = props;
        goTo(
          router,
          'job-result',
          'job/(:id)/results',
          params,
          {},
          location.query
        );
      },
    })
  )
);
