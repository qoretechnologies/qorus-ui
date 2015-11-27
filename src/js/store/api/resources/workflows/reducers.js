import { updateItemWithId } from '../../utils';


const setOptions = {
  next(state, action) {
    const { name, value } = action.meta.option;
    const workflow = state.data.find(w => w.id === action.meta.workflowId);
    const options = Array.from(workflow.options);
    const optIdx = options.findIndex(o => o.name === name);

    if (value !== '' && value !== null && optIdx < 0) {
      options.push({ name, value });
    } else if (value !== '' && value !== null) {
      options[optIdx] = Object.assign({}, options[optIdx], { value });
    } else if (optIdx >= 0) {
      options.splice(optIdx, 1);
    }

    return Object.assign({}, state, {
      data: updateItemWithId(
        workflow.id,
        { options },
        state.data
      )
    });
  },
  throw(state, action) {
    return {
      ...state,
      sync: false,
      loading: false,
      error: action.payload
    };
  }
};


export { setOptions as SETOPTIONS };
