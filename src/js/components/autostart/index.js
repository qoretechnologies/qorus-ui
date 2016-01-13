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
  };

  static defaultProps = {
    autostart: 0,
    execCount: 0,
    inc: (ctx, val) => val,
    dec: (ctx, val) => val
  };

  componentWillMount() {
    this.prepareActions(this.props);
  }

  componentWillUpdate(nextProps) {
    this.prepareActions(nextProps);
  }

  prepareActions(props) {
    this.decrement = this.changeAutostart.bind(this, props.dec, -1);
    this.increment = this.changeAutostart.bind(this, props.inc, +1);
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
    const { autostart, execCount, context } = this.props;

    if (!context) throw new Error('Property context must be provided.');

    const equals = (autostart === execCount && autostart > 0);
    const classes = classNames({
      'autostart-change': true,
      btn: true,
      'btn-xs': true,
      'btn-success': equals
    });

    return (
      <div className='autostart'>
        <Controls grouped>
          <Control
            title='Decrease'
            icon='minus'
            action={this.decrement}
          />
          <button className={classes} title='Click to edit'>
            {autostart}
          </button>
          <Control
            title='Increase'
            icon='plus'
            action={this.increment}
          />
        </Controls>
      </div>
    );
  }
}
