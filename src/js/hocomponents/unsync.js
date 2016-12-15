// @flow
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import setDisplayName from 'recompose/setDisplayName';


export default (
  func: string = 'unsync',
): Function => (Component: ReactClass<*>): ReactClass<*> => (
  compose(
    lifecycle({
      componentWillUnmount() {
        this.props[func]();
      },
    }),
    setDisplayName('withUnsync')
  )(Component)
);
