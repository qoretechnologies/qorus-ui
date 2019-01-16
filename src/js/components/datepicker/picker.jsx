/* @flow */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Controls, Control } from '../controls';
import pure from 'recompose/onlyUpdateForKeys';
import { Intent, InputGroup, ControlGroup } from '@blueprintjs/core';

@pure(['minutes', 'hours', 'children', 'futureOnly'])
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
          label="24h"
          btnStyle="default"
          action={this.props.on24hClick}
        />
        <Control
          label="All"
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
        <ControlGroup fill className="pt-small">
          <Control iconName="time" />
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
            iconName="undo"
            title="Reset"
            action={this.props.onResetClick}
          />
        </ControlGroup>
        <div className="datepicker-submit">
          {this.renderControls()}
          <Control
            className="pull-right"
            intent={Intent.PRIMARY}
            onClick={this.props.onApplyClick}
            iconName="small-tick"
          >
            Apply
          </Control>
        </div>
      </div>
    );
  }
}
