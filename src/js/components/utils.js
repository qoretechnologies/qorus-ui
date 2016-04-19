import { isEqual } from 'lodash';

/**
 * Checks if props or state changed on bound React component.
 *
 * It uses `shallowCompare` React add-on.
 *
 * @param {Object} nextProps
 * @param {Object} nextState
 * @this {ReactComponent}
 * @return {boolean}
 */
function shouldComponentUpdate(nextProps, nextState) {
  return !(isEqual(this.props, nextProps) && isEqual(this.state, nextState));
}


/**
 * Provides `shouldComponentUpdate` with shallow equality check for
 * props and state changes.
 *
 * It checks if class has prototype and that prototype has no
 * `shouldComponentUpdate` property.
 *
 * @param {ReactClass} CompCls
 * @see shouldComponentUpdate
 */
export function pureRender(CompCls) {
  if (!CompCls || !CompCls.prototype) {
    throw new Error('Only class can be decorated');
  }

  if (CompCls.prototype.shouldComponentUpdate) {
    throw new Error('Method shouldComponentUpdate already set');
  }

  Object.assign(CompCls.prototype, { shouldComponentUpdate });
}
