import withHandlers from 'recompose/withHandlers';

import Label from './label';

export default withHandlers({
  onMouseOver: ({ children, onInputSelected }) => () => onInputSelected(children),
  onMouseOut: ({ onInputUnselected }) => () => onInputUnselected(),
})(Label);
