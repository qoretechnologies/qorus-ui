import { handleActions } from 'redux-actions';

const workflowsReducer = handleActions({
  FETCH_WORKFLOWS: (state, action) => {
    console.log('reducer FETCH_WORKFLOWS', reducer);
    return {
      workflows: action.data()
    };
  }

});

export default workflowsReducer;