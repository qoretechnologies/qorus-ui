import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { pureRender } from '../utils';


@pureRender
export default class Group extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    size: PropTypes.number,
    url: PropTypes.string,
    disabled: PropTypes.bool
  }

  render() {
    return (
      <a href={this.props.url || '#'}>
        <span
            className={classNames({
              label: true,
              'label-info': !this.props.disabled
            })}>
          {this.props.name}
          {typeof this.props.size !== 'undefined' &&
           ' '}
          {typeof this.props.size !== 'undefined' &&
           <small>({this.props.size})</small>}
        </span>
      </a>
    );
  }
}
