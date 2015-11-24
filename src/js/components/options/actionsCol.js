import React, { Component, PropTypes } from 'react';


export default class ActionsCol extends Component {
  static propTypes = {
    context: PropTypes.any,
    onDelete: PropTypes.func
  }

  render() {
    return this.props.onDelete && (
      <a
        className='label label-danger'
        onClick={() => this.props.onDelete(this.props.context)}
      >
        <i className='fa fa-times' />
      </a>
    );
  }
}
