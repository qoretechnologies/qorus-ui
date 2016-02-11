import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { pureRender } from '../utils';


/**
 * Value display in a badge potentially with a link.
 *
 * If displayed value is greater then zero, a badge from Bootstrap is
 * applied. It a label is passed as a prop and the value is greater
 * than zero, then a special modifier is applied to this badge (see
 * accompanying stylesheet).
 *
 * Passing a URL as a prop wraps the badge in a link.
 */
@pureRender
export default class Badge extends Component {
  static propTypes = {
    url: PropTypes.string,
    val: PropTypes.number,
    label: PropTypes.string,
  };


  static defaultProps = {
    label: '',
  };


  /**
   * Returns badge value wrapped in indicating classes.
   *
   * @return {ReactElement}
   */
  renderValue() {
    return (
      <span
        className={classNames({
          badge: this.props.val > 0,
          [`badge--${this.props.label}`]: this.props.label &&
                                          this.props.val > 0,
        })}
      >
        {this.props.val}
      </span>
    );
  }


  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    return this.props.url ? (
      <a href={this.props.url}>{this.renderValue()}</a>
    ) : (
      this.renderValue()
    );
  }
}