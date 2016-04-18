import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { CHECKBOX_CLASSES } from '../../constants/checkbox';
import { pureRender } from '../utils';

@pureRender
export default class extends Component {
  static propTypes = {
    checked: PropTypes.string,
    action: PropTypes.func,
  };

  componentWillMount() {
    this.setState({
      checked: this.props.checked,
    });
  }

  componentWillReceiveProps(next) {
    if (this.props.checked !== next.checked) {
      this.setState({
        checked: next.checked,
      });
    }
  }

  /**
   * Checks / Unchecks the checkbox based on state
   * Stops further propagation
   * Runs provided function from the props.action
   * @param {Event} event
   */
  handleClick = (event) => {
    event.preventDefault();
    const checked = this.state.checked === 'CHECKED' ? 'UNCHECKED' : 'CHECKED';

    this.setState({
      checked,
    });

    if (this.props.action) {
      this.props.action(event);
    }
  };

  render() {
    const className = classNames('fa', CHECKBOX_CLASSES[this.state.checked]);

    return (
      <i
        className={className}
        onClick={this.handleClick}
      />
    );
  }
}
