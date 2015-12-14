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
  static propTypes = {
    autostart: PropTypes.number,
    execCount: PropTypes.number,
    inc: PropTypes.func.isRequired,
    dec: PropTypes.func.isRequired,
    context: PropTypes.any
  }

  static defaultProps = {
    autostart: 0,
    execCount: 0,
    inc: (ctx, val) => val,
    dec: (ctx, val) => val
  }

  /**
   * Calls fn with context and autostart modified by delta.
   *
   * @param {function} fn
   * @param {number} delta
   */
  changeAutostart(fn, delta) {
    fn(this.props.context, this.props.autostart + delta);
  }

  render() {
    const { autostart, execCount, inc, dec, context } = this.props;

    if (!context) throw new Error('Property context must be provided.');

    const equals = (autostart === execCount && autostart > 0);
    const classes = classNames({
      'autostart-change': true,
      'btn': true,
      'btn-xs': true,
      'btn-success': equals
    });

    return (
      <div className='autostart'>
        <Controls grouped>
          <Control
            title='Decrease'
            icon='minus'
            action={this.changeAutostart.bind(this, dec, -1)}
          />
          <button className={classes} title='Click to edit'>
            {autostart}
          </button>
          <Control
            title='Increase'
            icon='plus'
            action={this.changeAutostart.bind(this, inc, +1)}
          />
        </Controls>
      </div>
    );
  }
}
