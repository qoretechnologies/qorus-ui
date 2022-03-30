/* @flow */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Controls, Control } from '../controls';
import pure from 'recompose/onlyUpdateForKeys';
import { Intent, InputGroup, ControlGroup } from '@blueprintjs/core';
import { injectIntl, FormattedMessage } from 'react-intl';

@pure(['minutes', 'hours', 'children', 'futureOnly'])
@injectIntl
export default class Picker extends Component {
  props: {
    minutes: string | number,
    hours: string | number,
    onAllClick: () => void,
    onApplyClick: () => void,
    on24hClick: () => void,
    onResetClick: () => void,
    onMinutesChange: () => void,
    onHoursChange: () => void,
    hideDatepicker: () => void,
    // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
    children?: Array<React.Element<any>>,
    futureOnly: boolean,
  } = this.props;

  componentDidMount(): void {
    // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
    document.addEventListener('click', this.handleOutsideClick);
  }

  componentWillUnmount(): void {
    // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
    document.removeEventListener('click', this.handleOutsideClick);
  }

  handleOutsideClick: Function = (event: Object): void => {
    const el = ReactDOM.findDOMNode(this.refs.datepicker);

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'target' does not exist on type 'Object'.
    if (!el.contains(event.target)) {
      this.props.onResetClick();
      this.props.hideDatepicker();
    }
  };

  // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  renderControls(): ?React.Element<Controls> {
    if (this.props.futureOnly) return undefined;

    return (
      <Controls>
        <Control
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ minutes:... Remove this comment to see the full error message
          label={this.props.intl.formatMessage({ id: 'datetime.24h' })}
          btnStyle="default"
          action={this.props.on24hClick}
        />
        <Control
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ minutes:... Remove this comment to see the full error message
          label={this.props.intl.formatMessage({ id: 'datetime.all' })}
          btnStyle="default"
          action={this.props.onAllClick}
        />
      </Controls>
    );
  }

  // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  render(): React.Element<any> {
    return (
      <div className="datepicker" ref="datepicker">
        {this.props.children}
        <ControlGroup fill className="bp3-small">
          <Control icon="time" />
          <InputGroup
            type="number"
            name="hours"
            max="23"
            min="0"
            // @ts-expect-error ts-migrate(2322) FIXME: Type 'string | number' is not assignable to type '... Remove this comment to see the full error message
            value={this.props.hours}
            onChange={this.props.onHoursChange}
          />
          <Control text=":" />
          <InputGroup
            type="number"
            name="minutes"
            max="59"
            min="0"
            // @ts-expect-error ts-migrate(2322) FIXME: Type 'string | number' is not assignable to type '... Remove this comment to see the full error message
            value={this.props.minutes}
            onChange={this.props.onMinutesChange}
          />
          <Control
            icon="undo"
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ minutes:... Remove this comment to see the full error message
            title={this.props.intl.formatMessage({ id: 'datetime.reset' })}
            action={this.props.onResetClick}
          />
        </ControlGroup>
        <div className="datepicker-submit">
          {this.renderControls()}
          <Controls>
            <Control
              className="pull-right"
              intent={Intent.SUCCESS}
              onClick={this.props.onApplyClick}
              icon="small-tick"
            >
              <FormattedMessage id='datetime.apply' />
            </Control>
          </Controls>
        </div>
      </div>
    );
  }
}
