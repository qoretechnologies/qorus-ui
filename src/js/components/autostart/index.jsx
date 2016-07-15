/* @flow */
import React, { Component, PropTypes } from 'react';
import { Controls, Control } from '../controls';

import classNames from 'classnames';
import { pureRender } from '../utils';

/**
 * Counter component relying on inc and dec props to change the value.
 *
 * It also visualizes difference between autostart (counter value) and
 * execCount (a value actually used by something). If they are the
 * same, it is considered healthy.
 */
@pureRender
export default class AutoStart extends Component {
  static defaultProps = {
    autostart: 0,
    execCount: 0,
    inc: (ctx, val) => val,
    dec: (ctx, val) => val,
  };

  props: {
    autostart: number,
    execCount: number,
    inc: () => number,
    dec: () => number,
    context: any,
  };

  handleDecrementClick: Function = () => {
    this.props.dec(this.props.context, this.props.autostart - 1);
  };

  handleIncrementClick: Function = () => {
    this.props.inc(this.props.context, this.props.autostart + 1);
  };

  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    return (
      <div className="autostart">
        <Controls grouped>
          <Control
            title="Decrease"
            icon="minus"
            action={this.handleDecrementClick}
          />
          <button
            className={classNames({
              autostart__change: true,
              btn: true,
              'btn-xs': true,
              'btn-success': this.props.autostart === this.props.execCount &&
                             this.props.autostart && this.props.autostart > 0,
            })}
            title="Click to edit"
          >
            {this.props.autostart}
          </button>
          <Control
            title="Increase"
            icon="plus"
            action={this.handleIncrementClick}
          />
        </Controls>
      </div>
    );
  }
}

AutoStart.propTypes = {
  autostart: PropTypes.number,
  execCount: PropTypes.number,
  inc: PropTypes.func.isRequired,
  dec: PropTypes.func.isRequired,
  context: PropTypes.any.isRequired,
};
