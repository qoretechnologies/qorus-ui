import React, { PropTypes } from 'react';
import mapProps from 'recompose/mapProps';


import Section from './section';
import Row from './row';
import Cell from './cell';
import EditableCell from './editable_cell';

/**
 * Table supporting static and dynamic sections.
 *
 * Dynamic sections are yielded from generator returned by `sections`
 * prop. This prop is passed `data` prop as an argument (it can be
 * undefined). Because this is a pure component, `data` prop also acts
 * as a part of cache key. Therefore, generator returned by `sections`
 * prop should return the same if `data` does not change.
 *
 * Static sections or other table content can be passed directly as
 * children.
 *
 * Dynamic section rendering is preferred over static if both methods
 * are defined.
 *
 * @param {!{
 *   sections: ?function,
 *   data: *,
 *   children: ReactNode,
 * }} props
 * @return {!ReactElement}
 */
export default function Table(props) {
  const { sections, data, children, ...restProps } = props;

  return React.createElement(
    'table',
    restProps,
    ...(sections ? sections(data) : React.Children.toArray(children))
  );
}

Table.propTypes = {
  sections: PropTypes.func,
  data: PropTypes.any,
  children: PropTypes.node,
};

const Th = mapProps(props => ({ ...props, tag: 'th' }))(Cell);
Th.displayName = 'Th';
const Td = mapProps(props => ({ ...props, tag: 'td' }))(Cell);
Td.displayName = 'Td';

export {
  Section,
  Row,
  Cell,
  EditableCell,
  Th,
  Td,
};
