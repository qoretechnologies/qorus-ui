import { createAction } from 'redux-actions';

import actions from '../../../../constants/alerts';

export const markAllAsRead = createAction(actions.MARK_ALL_AS_READ, (type = null) => ({ type }));
