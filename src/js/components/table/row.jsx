import React, { Component, PropTypes } from 'react';


import { pureRender } from '../utils';


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
 */
@pureRender
export default class Row extends Component {
  static propTypes = {
    cells: PropTypes.func,
    data: PropTypes.any,
    children: PropTypes.node,
  };


  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    const { cells, data, children, ...props } = this.props;

    return React.createElement(
      'tr',
      props,
      ...(cells ? cells(data) : React.Children.toArray(children))
    );
  }
}
