// @flow
import { handleActions } from 'redux-actions';
import ACTIONS from './types';
import size from 'lodash/size';

export type State = {
  data: Array<Object>,
  count: number,
};

const initialState: State = {
  data: [],
  count: 0,
};

export default handleActions(
  {
    [ACTIONS.ADD]: (state: State, { payload: { events } }) => {
      const data: Array<Object> = [...state.data];

      events.forEach((event: Object) => {
        data.unshift(event);
      });

      const count: number = size(data);

      return { ...state, ...{ data, count } };
    },
  },
  initialState
);
