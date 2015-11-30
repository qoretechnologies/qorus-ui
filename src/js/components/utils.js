import { isEqual } from 'lodash';


/**
 * Provides `shouldComponentUpdate` with deep equality check for props
 * and state changes.
 *
 * @param {ReactClass} CompCls
 */
// TODO Consider using React's PureRenderMixin.
export function pureRender(CompCls) {
  if (!CompCls || !CompCls.prototype) {
    throw new Error('Only class can be decorated');
  }

  if (CompCls.prototype.shouldComponentUpdate) {
    throw new Error('Method shouldComponentUpdate already set');
  }

  Object.assign(CompCls.prototype, {
    shouldComponentUpdate(nextProps, nextState) {
      return (
        !isEqual(this.props, nextProps) ||
        !isEqual(this.state, nextState)
      );
    }
  });
}
