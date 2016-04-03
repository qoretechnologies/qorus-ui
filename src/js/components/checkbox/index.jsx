import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class extends Component {
  static propTypes = {
    checked: PropTypes.bool,
    action: PropTypes.func,
  };

  componentWillMount() {
    this.setState({
      checked: this.props.checked,
    });
  }

  componentWillReceiveProps(next) {
    if(this.props.checked !== next.checked) {
      this.setState({
        checked: next.checked,
      });
    }
  }

  /**
   * Checks / Unchecks the checkbox based on state
   * Stops further propagation
   * Runs provided function from the props.action
   * @param event
   */
  onCheckboxClick(event) {
    event.preventDefault();

    this.setState({
      checked: !this.state.checked,
    });

    if (this.props.action) {
      this.props.action(event);
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
