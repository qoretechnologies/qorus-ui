import React, { Component, PropTypes } from 'react';


import { pureRender } from '../utils';


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
 */
@pureRender
export default class Section extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['head', 'body', 'foot']).isRequired,
    rows: PropTypes.func,
    data: PropTypes.any,
    children: PropTypes.node,
  };


  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    const { type, rows, data, children, ...props } = this.props;

    return React.createElement(
      `t${type}`,
      props,
      ...(rows ? rows(data) : React.Children.toArray(children))
    );
  }
}
