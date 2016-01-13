import React, { Component, PropTypes } from 'react';


import classNames from 'classnames';
import { pureRender } from '../utils';


/**
 * Container component for {@link Control} components.
 *
 * It allows overriding of child components props via its own
 * `controls` prop. This prop is an array of props objects in the same
 * order as child components.
 */
@pureRender
export default class Controls extends Component {
  static propTypes = {
    grouped: PropTypes.bool,
    controls: PropTypes.array,
    children: PropTypes.node
  };

  static defaultProps = {
    grouped: false,
    controls: []
  };

  render() {
    return (
      <div
        className={classNames({
          'btn-controls': true,
          'btn-group': this.props.grouped
        })}
      >
        {React.Children.map(this.props.children, (c, i) => {
          if (!c) return c;

          return (
            <c.type {...c.props} {...this.props.controls[i]} />
          );
        })}
      </div>
    );
  }
}
