import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';


/**
 * Tab pane with content.
 */
export default class Pane extends Component {
  static propTypes = {
    slug: PropTypes.string,
    name: PropTypes.string.isRequired,
    active: PropTypes.bool,
    onActiveChange: PropTypes.func,
    disabled: PropTypes.bool,
    children: PropTypes.node,
  };


  static defaultProps = {
    onActiveChange: () => undefined,
  };


  /**
   * Calls active change callback.
   *
   * @see activeDidChange
   */
  componentDidMount() {
    this.activeDidChange();
  }


  /**
   * Calls active change callback if `active` prop changed.
   *
   * @see activeDidChange
   */
  componentDidUpdate(prevProps) {
    if (prevProps.active !== this.props.active) {
      this.activeDidChange();
    }
  }


  /**
   * Calls `onActiveChange` prop callback with current active slug.
   */
  activeDidChange() {
    this.props.onActiveChange(this.props.active);
  }


  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    if (!this.props.slug) {
      throw new Error('Property slug must be provided by parent component.');
    }

    return (
      <div
        id={this.props.slug}
        className={classNames({
          'tab-pane': true,
          active: this.props.active,
          disabled: this.props.disabled,
        })}
      >
        {this.props.children}
      </div>
    );
  }
}
