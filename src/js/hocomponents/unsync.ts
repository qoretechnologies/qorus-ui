// @flow
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import setDisplayName from 'recompose/setDisplayName';

export default (
    func: string = 'unsync'
    // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'ReactClass'.
  ): Function =>
  (Component) =>
    compose(
      lifecycle({
        componentWillUnmount() {
          this.props[func]();
        },
      }),
      setDisplayName('withUnsync')
    )(Component);
