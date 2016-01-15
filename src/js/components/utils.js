import PureRenderMixin from 'react-addons-pure-render-mixin';
import _ from 'lodash';


/**
 * Checks if class has prototype and that prototype has no
 * shouldComponentUpdate property.
 *
 * It throws an error if otherwise.
 *
 * @param {ReactClass} CompCls
 */
function checkClassForPureRender(CompCls) {
  if (!CompCls || !CompCls.prototype) {
    throw new Error('Only class can be decorated');
  }

  if (CompCls.prototype.shouldComponentUpdate) {
    throw new Error('Method shouldComponentUpdate already set');
  }
}


/**
 * Provides `shouldComponentUpdate` with shallow equality check for
 * props and state changes.
 *
 * It uses React's own PureRender mixin.
 *
 * @param {ReactClass} CompCls
 */
export function pureRender(CompCls) {
  checkClassForPureRender(CompCls);

  Object.assign(CompCls.prototype, {
    shouldComponentUpdate: PureRenderMixin.shouldComponentUpdate
  });
}


/**
 * Provides `shouldComponentUpdate` with shallow equality check for
 * props and state changes.
 *
 * It uses React's own PureRender mixin. But removes props from
 * nextProps according to `predicate` (see, `_.omit`).
 *
 * @param {...(string|string[])} props
 * @return {function(ReactClass)}
 */
export function pureRenderOmit(predicate) {
  return CompCls => {
    checkClassForPureRender(CompCls);

    Object.assign(CompCls.prototype, {
      shouldComponentUpdate(nextProps, nextState) {
        return PureRenderMixin.shouldComponentUpdate.call(
          this,
          _.omit(nextProps, predicate),
          nextState
        );
      }
    });
  };
}
