import React, { Component, PropTypes } from 'react';
import { Control as Button } from '../controls';

import classNames from 'classnames';

import { pureRender } from '../utils';

@pureRender
export default class Editable extends Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    text: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    type: PropTypes.string,
    errorChecker: PropTypes.func,
  };

  componentWillMount() {
    this.setState({
      error: false,
      editing: false,
      value: this.props.value,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({
        value: nextProps.value,
      });
    }
  }

  handleFormSubmit = (event) => {
    event.preventDefault();

    if (this.props.errorChecker && !this.props.errorChecker(this.state.value)) {
      this.setState({
        error: true,
      });
    } else {
      if (this.props.onSubmit) {
        this.props.onSubmit(this.state.value);
      }

      this.setState({
        error: false,
        editing: false,
      });
    }
  };

  handleHeaderClick = () => {
    this.setState({
      editing: true,
    });
  };

  handleCancelClick = () => {
    this.setState({
      editing: false,
    });
  };

  handleInputChange = (event) => {
    this.setState({
      value: event.target.value,
    });
  };

  render() {
    const css = classNames('form-control', this.state.error ? 'form-error' : '');

    if (!this.state.editing) {
      return (
        <h3 onClick={this.handleHeaderClick}>
          {this.props.text}
        </h3>
      );
    }

    return (
      <form onSubmit={this.handleFormSubmit}>
        <div className="input-group col-sm-2">
          <input
            type={this.props.type}
            className={css}
            defaultValue={this.state.value}
            onChange={this.handleInputChange}
          />
          <div className="input-group-btn">
            <Button
              type="submit"
              big
              btnStyle="success"
              icon="save"
            />
            <Button
              type="button"
              big
              btnStyle="default"
              icon="times"
              action={this.handleCancelClick}
            />
          </div>
        </div>
      </form>
    );
  }
}
