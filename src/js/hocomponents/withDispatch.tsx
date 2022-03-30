// @flow
import { connect } from 'react-redux';
import actions from '../store/api/actions';

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'ReactClass'.
export default (): Function => (Component: ReactClass<*>): ReactClass<*> =>
  connect(
    null,
    {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'system' does not exist on type '{}'.
      dispatchAction: actions.system.withDispatchInjected,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'system' does not exist on type '{}'.
      optimisticDispatch: actions.system.withDispatchOptimisticInjected,
    }
  )(Component);
