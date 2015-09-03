import { createAction } from 'redux-actions';
import qorusApi from '../../lib/qorus-api';

export const fetch = createAction('FETCH_WORKFLOWS', () => {
  return qorusApi.workflows.getAll().then(res=> res.body());
});