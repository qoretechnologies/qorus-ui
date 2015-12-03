import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { pureRender } from './utils';


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
    autostart: PropTypes.number.isRequired,
    execCount: PropTypes.number.isRequired,
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
   * @param {Event} ev
   */
  onClick(fn, delta, ev) {
    ev.stopPropagation();

    fn(this.props.context, this.props.autostart + delta);
  }

  render() {
    const { autostart, execCount, inc, dec, context } = this.props;

    if (!context) throw new Error('Property context must be provided.');

    const equals = (autostart === execCount && autostart > 0);
    const classes = classNames({
      'label': true,
      'autostart-change': true,
      'label-default': !equals,
      'label-success': equals
    });

    return (
      <div className='autostart btn-controls btn-group'>
        <a
          className='label label-default'
          onClick={this.onClick.bind(this, dec, -1)}
        >
          <i className='fa fa-minus'></i>
        </a>
        <a className={classes} title='Click to edit'>
          {autostart}
        </a>
        <a
          className='label label-default'
          onClick={this.onClick.bind(this, inc, +1)}
        >
          <i className='fa fa-plus'></i>
        </a>
      </div>
    );
  }
}
