import React, { Component, PropTypes } from 'react';
import clNs from 'classnames';

class AutoStart extends Component {
  static propTypes = {
    autostart: PropTypes.integer.isRequired,
    execCount: PropTypes.integer.isRequired,
    inc: PropTypes.func.isRequired,
    dec: PropTypes.func.isRequired
  }

  render() {
    const { autostart, execCount, inc, dec } = this.props;

    const classes = clNs({
      'label': true,
      'autostart-change': true,
      'label-success': (
        autostart === execCount && autostart > 0
      )
    });

    return (
      <div className='autostart btn-controls'>
        <a className='labelu' onClick={dec}>
          <i className='fa-minus'></i>
          </a>
        <a className={ classes } title='Click to edit' data-toggle='tooltip'>
          { model.get('autostart') }
          </a>
        <a className='label' onClick={inc}>
          <i className='fa-plus'></i>
        </a>
      </div>
    );
  }
}

export default AutoStart;
