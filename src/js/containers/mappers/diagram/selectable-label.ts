import withHandlers from 'recompose/withHandlers';

import Label from './label';

export default withHandlers({
  onMouseOver: ({ children, onInputSelected }) => () => onInputSelected(children),
  onMouseOut: ({ onInputUnselected }) => () => onInputUnselected(),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
  onClick: ({ children, setActive = () => {} }) => () => setActive(children),
})(Label);
