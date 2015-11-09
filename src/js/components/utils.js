import { isEqual, omit } from 'lodash';

export const pureRender = (component, toOmit = '') => {
  if (!component || !component.prototype) {
    throw new Error('Only class can be decorated');
  }

  if (component.shouldComponentUpdate) {
    throw new Error('Method shouldComponentUpdate already set');
  }

  Object.assign(component.prototype, {
    shouldComponentUpdate(nextProps, nextState) {
      return (
        !isEqual(omit(this.props, toOmit), omit(nextProps, toOmit)) ||
        !isEqual(this.state, nextState)
      );
    }
  });
};

export const pureRenderOmit = (toOmit = '') => (component) => {
  pureRender(component, toOmit);
};
