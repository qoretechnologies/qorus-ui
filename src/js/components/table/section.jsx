import React, { PropTypes } from 'react';


/**
 * Table section supporting static and dynamic rows.
 *
 * Dynamic rows are yielded from generator returned by `rows`
 * prop. This prop is passed `data` prop as an argument (it can be
 * undefined). Because this is a pure component, `data` prop also acts
 * as a part of cache key. Therefore, generator returned by `rows`
 * prop should return the same rows if `data` does not change.
 *
 * Static rows can be passed directly as children.
 *
 * Dynamic row rendering is preferred over static if both methods are
 * defined.
 *
 * @param {!{
 *   cells: ?function,
 *   data: *,
 *   children: ReactNode,
 * }} props
 * @return {!ReactElement}
 */
export default function Section(props) {
  const { type, rows, data, children, ...restProps } = props;

  return React.createElement(
    `t${type}`,
    restProps,
    ...(rows ? rows(data) : React.Children.toArray(children))
  );
}

Section.propTypes = {
  type: PropTypes.oneOf(['head', 'body', 'foot']).isRequired,
  rows: PropTypes.func,
  data: PropTypes.any,
  children: PropTypes.node,
};
