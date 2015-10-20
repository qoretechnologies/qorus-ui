import { isEqual, omit } from 'lodash';

export const pureRender = (component, toOmit = '') => {
  if (component && component.prototype) {
    Object.assign(component.prototype, {
      shouldComponentUpdate(nextProps, nextState) {
        // const toOmit = ['children', 'rowClick'];
        return !isEqual(omit(this.props, toOmit), omit(nextProps, toOmit))
               || !isEqual(this.state, nextState);
      }
    });
  }
};

export const pureRenderOmit = (toOmit = '') => (component) => {
  pureRender(component, toOmit);
};
