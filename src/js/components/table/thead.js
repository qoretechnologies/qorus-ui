import React, { Component } from 'react';
import Cell from './cell';


import { pureRender } from '../utils';


/**
 * Table head section (thead) component.
 *
 * It expects Col components passed as children. Every Col is turned
 * to Cell element with prop comp = th. It uses Col#prop.heading as a
 * child for Cell element.
 *
 * If no child is given, nothing is rendered.
 */
@pureRender
export default class THead extends Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired
  }

  hasHeadings() {
    return React.Children.toArray(this.props.children).
      some(col => col.props.heading);
  }

  render() {
    return (
      <thead>
        {this.hasHeadings() && (
          <tr>
            {React.Children.map(this.props.children, col => {
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
