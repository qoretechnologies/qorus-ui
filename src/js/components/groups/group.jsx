import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import { pureRender } from '../utils';


/**
 * Bootstrap label displaying info about a group.
 *
 * Group can be disabled and can have optionally a size and a URL. If
 * URL is givven, the label is rendered in link.
 */
@pureRender
export default class Group extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    size: PropTypes.number,
    url: PropTypes.string,
    disabled: PropTypes.bool
  };


  /**
   * Returns label with optional size and with classes set.
   *
   * @return {ReactElement}
   */
  renderLabel() {
    return (
      <span
        className={classNames({
          label: true,
          'label-info': !this.props.disabled
        })}
      >
        {this.props.name}
        {typeof this.props.size !== 'undefined' && ' '}
        {typeof this.props.size !== 'undefined' && (
          <small>({this.props.size})</small>
        )}
      </span>
    );
  }


  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    return !this.props.url ? (
      <span className='group'>
        {this.renderLabel()}
      </span>
    ) : (
      <Link to={this.props.url} className='group'>
        {this.renderLabel()}
      </Link>
    );
  }
}
