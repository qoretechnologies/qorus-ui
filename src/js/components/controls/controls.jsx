/* @flow */
import React, { Component, PropTypes } from 'react';

import Control from './control';
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
  static defaultProps = {
    grouped: false,
    controls: [],
  };

  props: {
    grouped?: boolean,
    controls: Array<React.Element<Control>>,
    children: Array<React.Element<any>>,
    noControls?: boolean,
  };

  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    return (
      <div
        className={classNames({
          'btn-controls': !this.props.noControls,
          'btn-group': this.props.grouped,
        })}
      >
        {React.Children.map(this.props.children, (c, i): ?React.Element<any> => {
          if (!c) return c;

          return (
            <c.type {...c.props} {...this.props.controls[i]} />
          );
        })}
      </div>
    );
  }
}

Controls.propTypes = {
  grouped: PropTypes.bool,
  controls: PropTypes.array,
  children: PropTypes.node,
  noControls: PropTypes.bool,
};
