/* @flow */
import React, { Component } from 'react';
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
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
  props: Props = this.props;

  state: {
    error: boolean,
    editing: boolean,
    value: string | number,
  };

  // @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'state'.
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
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'preventDefault' does not exist on type '... Remove this comment to see the full error message
    event.preventDefault();

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
    if (this.props.errorChecker && !this.props.errorChecker(this.state.value)) {
      this.setState({
        error: true,
      });
    } else {
      if (this.props.onSubmit) {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
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
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'target' does not exist on type 'Object'.
      value: event.target.value,
    });
  };

  // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  render(): React.Element<any> {
    const css: string = classNames('form-control', this.state.error ? 'form-error' : '');

    if (!this.state.editing) {
      return (
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message
        <h3 onClick={this.handleHeaderClick}>
          {this.props.text}
        </h3>
      );
    }

    return (
      // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
      <form onSubmit={this.handleFormSubmit}>
        <div className="input-group col-sm-2">
          <input
            type={this.props.type}
            className={css}
            defaultValue={this.state.value}
            // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'ChangeE... Remove this comment to see the full error message
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
