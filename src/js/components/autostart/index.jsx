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


  /**
   * Creates decrement and increment function from given props.
   *
   * @see prepareActions
   */
  componentWillMount() {
    this.prepareActions(this.props);
  }


  /**
   * Creates decrement and increment function from next props.
   *
   * @see prepareActions
   */
  componentWillUpdate(nextProps) {
    this.prepareActions(nextProps);
  }


  /**
   * Creates decrement and increment function.
   *
   * They are created by binding changeAutostart to dec and inc
   * functions with delta value.
   *
   * @param {function} dec
   * @param {function} inc
   */
  prepareActions({ dec, inc }) {
    this.decrement = this.changeAutostart.bind(this, dec, -1);
    this.increment = this.changeAutostart.bind(this, inc, +1);
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


  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    if (!this.props.context) {
      throw new Error('Property context must be provided.');
    }

    return (
      <div className='autostart'>
        <Controls grouped>
          <Control
            title='Decrease'
            icon='minus'
            action={this.decrement}
          />
          <button
            className={classNames({
              'autostart__change': true,
              btn: true,
              'btn-xs': true,
              'btn-success': this.props.autostart === this.props.execCount &&
                             this.props.autostart > 0
            })}
            title='Click to edit'
          >
            {this.props.autostart}
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
