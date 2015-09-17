import React, { Component, PropTypes } from 'react';
import clNs from 'classnames';

class AutoStart extends Component {
  static propTypes = {
    autostart: PropTypes.number.isRequired,
    execCount: PropTypes.number.isRequired,
    inc: PropTypes.func.isRequired,
    dec: PropTypes.func.isRequired,
    id: PropTypes.number.isRequired
  }

  static defaultProps = {
    autostart: 0,
    execCount: 0,
    inc: (x) => x + 1,
    dec: (x) => x - 1
  }

  render() {
    const { autostart, execCount, inc, dec, id } = this.props;
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
          onClick={ (...args) => { dec(id, ...args); }}>
          <i className='fa fa-minus'></i>
          </a>
        <a className={ classes } title='Click to edit'>
          { autostart }
          </a>
        <a className='label label-default'
          onClick={(...args) => { inc(id, ...args); }}>
          <i className='fa fa-plus'></i>
        </a>
      </div>
    );
  }
}

export default AutoStart;
