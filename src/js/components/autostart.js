import React, { Component, PropTypes } from 'react';
import clNs from 'classnames';
import { preventDefault } from '../utils';

class AutoStart extends Component {
  static propTypes = {
    autostart: PropTypes.number.isRequired,
    execCount: PropTypes.number.isRequired,
    inc: PropTypes.func.isRequired,
    dec: PropTypes.func.isRequired,
    id: PropTypes.number
  }

  static defaultProps = {
    autostart: 0,
    execCount: 0,
    inc: (x) => x + 1,
    dec: (x) => x - 1
  }

  render() {
    const { autostart, execCount, inc, dec, id } = this.props;

    if (!id) throw new Error('Property id must be provided.');

    const equals = (autostart === execCount && autostart > 0);
    const classes = clNs({
      'label': true,
      'autostart-change': true,
      'label-default': !equals,
      'label-success': equals
    });

    return (
      <div className='autostart btn-controls btn-group'>
        <a className='label label-default'
          onClick={ preventDefault((...args) => {
            dec(id, autostart - 1, ...args);
          }) }>
          <i className='fa fa-minus'></i>
          </a>
        <a className={ classes } title='Click to edit'>
          { autostart }
          </a>
        <a className='label label-default'
          onClick={ preventDefault((...args) => {
            inc(id, autostart + 1, ...args);
          }) }>
          <i className='fa fa-plus'></i>
        </a>
      </div>
    );
  }
}

export default AutoStart;
