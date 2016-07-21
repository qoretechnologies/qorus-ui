/* @flow */
import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { Controls, Control } from '../controls';

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
  };

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
      <Controls grouped noControls>
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
        { this.props.children }
        <div className="hours row-fluid">
          <div className="input-group input-group-sm">
            <div className="input-group-addon">
              <i className="fa fa-clock-o" />
            </div>
            <input
              type="number"
              name="hours"
              max="23"
              min="0"
              value={this.props.hours}
              onChange={this.props.onHoursChange}
              className="text-center form-control"
            />
            <div className="input-group-addon">:</div>
            <input
              type="number"
              name="minutes"
              max="59"
              min="0"
              value={this.props.minutes}
              onChange={this.props.onMinutesChange}
              className="text-center form-control"
            />
            <div className="input-group-btn">
              <Control
                icon="times"
                btnStyle="danger"
                action={this.props.onResetClick}
              />
            </div>
          </div>
        </div>
        { this.renderControls() }
        <button
          className="btn btn-primary btn-xs pull-right"
          onClick={this.props.onApplyClick}
        >Apply
        </button>
      </div>
    );
  }
}

Picker.propTypes = {
  minutes: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  hours: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onAllClick: PropTypes.func,
  onApplyClick: PropTypes.func,
  on24hClick: PropTypes.func,
  onResetClick: PropTypes.func,
  onMinutesChange: PropTypes.func,
  onHoursChange: PropTypes.func,
  hideDatepicker: PropTypes.func,
  children: PropTypes.node,
  futureOnly: PropTypes.bool,
};
