import React, { Component, PropTypes } from 'react';
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
  render() {
    if (!React.Children.count(this.props.children)) return null;

    return (
      <thead>
        <tr>
          {React.Children.map(this.props.children, col => (
            <Cell comp='th'>
              {col.props.heading}
            </Cell>
          ))}
        </tr>
      </thead>
    );
  }
}
