/* @flow */
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
  static defaultProps = {
    label: '',
  };

  props: {
    url?: string,
    val: number | string,
    label: string,
    title?: string,
  };

  /**
   * Returns badge value wrapped in indicating classes.
   *
   * @return {ReactElement}
   */
  renderValue() {
    return (
      <span
        title={this.props.title}
        className={classNames({
          badge: this.props.val || false,
          [`alert-${this.props.label}`]: this.props.label && this.props.val || false,
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
      <a title={this.props.title} href={this.props.url}>{this.renderValue()}</a>
    ) : (
      this.renderValue()
    );
  }
}

Badge.propTypes = {
  url: PropTypes.string,
  val: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  label: PropTypes.string,
};
