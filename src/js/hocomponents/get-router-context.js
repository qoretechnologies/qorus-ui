import { PropTypes } from 'react';
import withContext from 'recompose/withContext';

export default withContext(
  {
    route: PropTypes.object,
    params: PropTypes.object,
  },
  ({ route, params }) => ({ route, params })
);
