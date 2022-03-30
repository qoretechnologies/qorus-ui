// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module 'redux' or its corresponding ty... Remove this comment to see the full error message
import { combineReducers } from 'redux';
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/store/ui/redu... Remove this comment to see the full error message
import * as reducers from './reducers';

export default combineReducers(reducers);
