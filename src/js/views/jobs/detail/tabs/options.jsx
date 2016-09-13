import compose from 'recompose/compose';
import { connect } from 'react-redux';
import withHandlers from 'recompose/withHandlers';

import Options from '../../../../components/options';
import actions from '../../../../store/api/actions';


const addOptionHandlers = withHandlers({
  onSet: ({ model, setOptions }) => opt => setOptions(model, opt),
  onDelete: ({ model, setOptions }) => opt => setOptions(model, { ...opt, value: '' }),
});

export default compose(
  connect(
    state => ({
      systemOptions: state.api.systemOptions.data.filter(opt => opt.job),
    }),
    { setOptions: actions.jobs.setOptions }
  ),
  addOptionHandlers,
)(Options);

