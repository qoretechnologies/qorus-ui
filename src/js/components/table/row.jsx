import React, { PropTypes } from 'react';


/**
 * Table row supporting static and dynamic cells.
 *
 * Dynamic cells are yielded from generator returned by `cells`
 * prop. This prop is passed `data` prop as an argument (it can be
 * undefined). Because this is a pure component, `data` prop also acts
 * as part of cache key. Therefore, generator returned by `cells` prop
 * should return the same cells if `data` does not change.
 *
 * Static cells can be passed directly as children.
 *
 * Dynamic cell rendering is preferred over static if both methods are
 * defined.
 *
 * @param {!{
 *   cells: ?function,
 *   data: *,
 *   children: ReactNode,
 * }} props
 * @return {!ReactElement}
 */
export default function Row(props) {
  const { cells, data, children, ...restProps } = props;

  return React.createElement(
    'tr',
    restProps,
    ...(cells ? cells(data) : React.Children.toArray(children))
  );
}

Row.propTypes = {
  cells: PropTypes.func,
  data: PropTypes.any,
  children: PropTypes.node,
};
