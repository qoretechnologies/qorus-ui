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
  read: true,
};

export default handleActions(
  {
    [ACTIONS.ADD]: (state: State, { payload: { events } }) => {
      const data: Array<Object> = [...state.data];

      events.forEach((event: Object) => {
        data.unshift(event);
      });

      const count: number = size(data);

      return { ...state, ...{ data, count, read: false } };
    },
    [ACTIONS.READ]: (state: State) => ({ ...state, ...{ read: true } }),
    [ACTIONS.DISMISS]: (state: State, { payload: { id } }) => {
      const data: Array<Object> = [...state.data].map(
        (datum: Object): Object => {
          const newDatum: Object = { ...datum };

          console.log(id);

          if (datum.alert === id || id === 'all') {
            newDatum.read = true;
          }

          return newDatum;
        }
      );

      return { ...state, ...{ data } };
    },
  },
  initialState
);
