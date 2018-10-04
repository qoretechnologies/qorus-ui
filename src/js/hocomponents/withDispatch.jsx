// @flow
import { connect } from 'react-redux';
import actions from '../store/api/actions';

export default (): Function => (Component: ReactClass<*>): ReactClass<*> =>
  connect(
    null,
    { dispatchAction: actions.system.withDispatchInjected }
  )(Component);
