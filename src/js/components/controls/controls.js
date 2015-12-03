import React, { Component, PropTypes } from 'react';
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
    controls: PropTypes.array,
    children: PropTypes.node
  };

  static defaultProps = {
    controls: []
  }

  render() {
    return (
      <div className='btn-controls'>
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
