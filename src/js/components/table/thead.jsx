import React, { Component } from 'react';
import Cell from './cell';


import { pureRenderOmit } from '../utils';


/**
 * Table head section (thead) component.
 *
 * It expects Col components passed as children. Every Col is turned
 * to Cell element with prop comp = th. It uses Col#prop.heading as a
 * child for Cell element.
 *
 * If no child is given, nothing is rendered.
 */
@pureRenderOmit('children')
export default class THead extends Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired
  };


  /**
   * Checks if there is any heading specified in child Col elements.
   *
   * @return {boolean}
   */
  hasHeadings() {
    return React.Children.toArray(this.props.children).
      some(col => col.props.heading);
  }


  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    return (
      <thead>
        {this.hasHeadings() && (
          <tr>
            {React.Children.map(this.props.children, col => {
              if (!col) return col;

              const { heading, comp, props, childProps, ...otherProps } =
                col.props;

              return (
                <Cell comp='th' props={otherProps}>
                  {heading}
                </Cell>
              );
            })}
          </tr>
        )}
      </thead>
    );
  }
}
