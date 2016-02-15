import React, { Component, PropTypes } from 'react';


import { pureRender } from '../utils';


/**
 * Flexible table cell with pure render for improved performance.
 */
@pureRender
export default class Cell extends Component {
  static propTypes = {
    tag: PropTypes.oneOf(['td', 'th']),
    children: PropTypes.node,
  };


  static defaultProps = {
    tag: 'td',
  };


  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    const { tag, children, ...props } = this.props;

    return React.createElement(
      tag,
      props,
      ...React.Children.toArray(children)
    );
  }
}
