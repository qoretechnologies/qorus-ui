/* @flow */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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
    children?: Array<React.Element<any>>,
    futureOnly: boolean,
  } = this.props;

  componentDidMount(): void {
    document.addEventListener('click', this.handleOutsideClick);
  }

  componentWillUnmount(): void {
    document.removeEventListener('click', this.handleOutsideClick);
  }

  handleOutsideClick: Function = (event: Object): void => {
    const el = ReactDOM.findDOMNode(this.refs.datepicker);

    if (!el.contains(event.target)) {
      this.props.onResetClick();
      this.props.hideDatepicker();
    }
  };

  renderControls(): ?React.Element<Controls> {
    if (this.props.futureOnly) return undefined;

    return (
      <Controls>
        <Control
          label={this.props.intl.formatMessage({ id: 'datetime.24h' })}
          btnStyle="default"
          action={this.props.on24hClick}
        />
        <Control
          label={this.props.intl.formatMessage({ id: 'datetime.all' })}
          btnStyle="default"
          action={this.props.onAllClick}
        />
      </Controls>
    );
  }

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
            value={this.props.hours}
            onChange={this.props.onHoursChange}
          />
          <Control text=":" />
          <InputGroup
            type="number"
            name="minutes"
            max="59"
            min="0"
            value={this.props.minutes}
            onChange={this.props.onMinutesChange}
          />
          <Control
            icon="undo"
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
