/* @flow */
import React, { Component } from 'react';
import { Control as Button } from '../controls';
import classNames from 'classnames';
import pure from 'recompose/onlyUpdateForKeys';

type Props = {
  onSubmit?: () => void,
  text?: string,
  value?: string | number,
  type: string,
  errorChecker?: () => boolean,
}

@pure([
  'text',
  'value',
  'type',
])
export default class Editable extends Component {
  props: Props;

  state: {
    error: boolean,
    editing: boolean,
    value: string | number,
  };

  state = {
    error: false,
    editing: false,
    value: this.props.value,
  };

  componentWillReceiveProps(nextProps: Props): void {
    if (this.props.value !== nextProps.value) {
      this.setState({
        value: nextProps.value,
      });
    }
  }

  handleFormSubmit: Function = (event: Object): void => {
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

  handleHeaderClick: Function = (): void => {
    this.setState({
      editing: true,
    });
  };

  handleCancelClick: Function = (): void => {
    this.setState({
      editing: false,
    });
  };

  handleInputChange: Function = (event: Object): void => {
    this.setState({
      value: event.target.value,
    });
  };

  render(): React.Element<any> {
    const css: string = classNames('form-control', this.state.error ? 'form-error' : '');

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
              iconName="save"
            />
            <Button
              type="button"
              big
              btnStyle="default"
              iconName="times"
              action={this.handleCancelClick}
            />
          </div>
        </div>
      </form>
    );
  }
}
