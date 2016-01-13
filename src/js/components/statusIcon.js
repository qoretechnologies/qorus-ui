import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { pureRender } from './utils';


/**
 * Status icon component dependent on value prop.
 */
@pureRender
export default class StatusIcon extends Component {
  static propTypes = {
    value: PropTypes.any
  };

  render() {
    return (
      <i
        className={classNames({
          'fa': true,
          'fa-check-circle': this.props.value,
          'fa-minus-circle': !this.props.value,
          'icon-success': this.props.value,
          'icon-error': !this.props.value
        })}
      />
    );
  }
}
