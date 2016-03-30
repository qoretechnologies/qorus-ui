import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class extends Component {
  static propTypes = {
    checked: PropTypes.bool.isRequired,
    action: PropTypes.func,
  };

  componentWillMount() {
    this.setState({
      checked: this.props.checked,
    });
  }

  /**
   * Checks / Unchecks the checkbox based on state
   * Stops further propagation
   * Runs provided function from the props.action
   * @param event
   */
  onCheckboxClick(event) {
    event.stopPropagation();

    this.setState({
      checked: !this.state.checked,
    });

    if (this.props.action) {
      this.props.action();
    }
  }

  render() {
    const className = classNames('fa', this.state.checked ? 'fa-check-square-o' : 'fa-square-o');

    return (
      <i
        className={className}
        onClick={::this.onCheckboxClick}
      />
    );
  }
}
