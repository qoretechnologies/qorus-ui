// @flow
import size from 'lodash/size';
import { handleActions } from 'redux-actions';
import ACTIONS from './types';

export type State = {
  data: Array<Object>;
  count: number;
};

const initialState: State = {
  data: [],
  count: 0,
  // @ts-ignore ts-migrate(2322) FIXME: Type '{ data: undefined[]; count: number; read: bo... Remove this comment to see the full error message
  read: true,
};

export default handleActions(
  {
    [ACTIONS.ADD]: (state: State, { payload: { events } }) => {
      const data: Array<Object> = [...state.data];

      events.forEach((event: any) => {
        data.unshift(event);
      });

      const count: number = size(data);

      return { ...state, ...{ data, count, read: false } };
    },
    [ACTIONS.READ]: (state: State) => ({ ...state, ...{ read: true } }),
    [ACTIONS.DISMISS]: (state: State, { payload: { id } }) => {
      const data: Array<Object> = [...state.data].map((datum: any): any => {
        const newDatum: any = { ...datum };

        // @ts-ignore ts-migrate(2339) FIXME: Property 'alert' does not exist on type 'Object'.
        if (datum.alert === id || id === 'all') {
          // @ts-ignore ts-migrate(2339) FIXME: Property 'read' does not exist on type 'Object'.
          newDatum.read = true;
        }

        return newDatum;
      });

      return { ...state, ...{ data } };
    },
  },
  initialState
);
