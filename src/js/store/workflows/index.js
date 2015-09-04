import { handleActions } from 'redux-actions';

const workflowsReducer = handleActions({
  FETCH_WORKFLOWS: (state, action) => {
    console.log('reducer FETCH_WORKFLOWS');
    return action.payload;
  }
}, []);

export default workflowsReducer;
