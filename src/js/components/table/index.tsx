import React from 'react';
import mapProps from 'recompose/mapProps';
import Cell from './cell';
import EditableCell from './editable_cell';
import Row from './row';
import Section from './section';

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
 *   sections: function,
 *   data: *,
 *   children: ReactNode,
 * }} props
 * @return {!ReactElement}
 */
export default function Table(props: Object) {
  // @ts-ignore ts-migrate(2339) FIXME: Property 'sections' does not exist on type 'Object... Remove this comment to see the full error message
  const { sections, data, children, ...restProps } = props;

  return React.createElement(
    'table',
    restProps,
    ...(sections ? sections(data) : React.Children.toArray(children))
  );
}

const Th = mapProps((props) => ({ ...props, tag: 'th' }))(Cell);
Th.displayName = 'Th';
const Td = mapProps((props) => ({ ...props, tag: 'td' }))(Cell);
Td.displayName = 'Td';

export { Section, Row, Cell, EditableCell, Th, Td };
