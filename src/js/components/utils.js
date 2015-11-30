import PureRenderMixin from 'react-addons-pure-render-mixin';


/**
 * Provides `shouldComponentUpdate` with shallow equality check for
 * props and state changes.
 *
 * It uses React's own PureRender mixin.
 *
 * @param {ReactClass} CompCls
 */
export function pureRender(CompCls) {
  if (!CompCls || !CompCls.prototype) {
    throw new Error('Only class can be decorated');
  }

  if (CompCls.prototype.shouldComponentUpdate) {
    throw new Error('Method shouldComponentUpdate already set');
  }

  Object.assign(CompCls.prototype, {
    shouldComponentUpdate: PureRenderMixin.shouldComponentUpdate
  });
}
