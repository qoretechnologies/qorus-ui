import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
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

  renderLabel() {
    return (
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
    );
  }

  render() {
    if (!this.props.url) return this.renderLabel();

    return (
      <Link to={this.props.url}>
        {this.renderLabel()}
      </Link>
    );
  }
}