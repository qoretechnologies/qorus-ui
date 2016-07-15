/* @flow */
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { CHECKBOX_CLASSES } from '../../constants/checkbox';
import { pureRender } from '../utils';

@pureRender
export default class Checkbox extends Component {
  props: {
    checked: string,
    action: () => void,
  };

  state: {
    checked: string,
  };

  state = {
    checked: this.props.checked,
  };

  componentWillReceiveProps(next: Object) {
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
   */
  handleClick = (event: Object) => {
    event.preventDefault();
    const checked: string = (this.state.checked: string) === 'CHECKED' ? 'UNCHECKED' : 'CHECKED';

    this.setState({
      checked,
    });

    if (this.props.action) {
      this.props.action(event);
    }
  };

  render() {
    const className: string = classNames('fa', CHECKBOX_CLASSES[this.state.checked]);

    return (
      <i
        className={className}
        onClick={this.handleClick}
      />
    );
  }
}

Checkbox.propTypes = {
  checked: PropTypes.string,
  action: PropTypes.func,
};
