import { isEqual } from 'lodash';

/**
 * Checks if props or state changed on bound React component.
 *
 * It uses deep equals.
 *
 * @param {Object} nextProps
 * @param {Object} nextState
 * @this {ReactComponent}
 * @return {boolean}
 */
function shouldComponentUpdate(nextProps, nextState) {
  // @ts-ignore ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
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

/**
 * Returns model normalizedName as <name> v<version>.<patch> <id>
 *
 * @param {Object} model
 * @param {string} idAttr - id attribute of model
 * @see shouldComponentUpdate
 */
export const normalizeName = (item, idAttr = 'id') => {
  const { name, version, patch } = item;
  const id = item[idAttr];

  const versionString: string = version ? ` v${version}${patch ? `.${patch}` : ''}` : '';

  const idString: string = id ? ` (${id})` : '';

  const normalizedName = `${name}${versionString}${idString}`;

  return normalizedName;
};
