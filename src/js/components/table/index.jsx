import React, { Component, PropTypes } from 'react';


import Section from './section';
import Row from './row';
import Cell from './cell';


import { pureRender } from '../utils';


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
 */
@pureRender
export default class Table extends Component {
  static propTypes = {
    sections: PropTypes.func,
    data: PropTypes.any,
    children: PropTypes.node,
  };


  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    const { sections, data, children, ...props } = this.props;

    return React.createElement(
      'table',
      props,
      ...(sections ? sections(data) : React.Children.toArray(children))
    );
  }
}


export { Section, Row, Cell };
