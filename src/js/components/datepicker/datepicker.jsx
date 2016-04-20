import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import Calendar from './calendar';
import { Controls, Control } from 'components/controls';

export default class extends Component {
  static propTypes = {
    date: PropTypes.object,
    setDate: PropTypes.func,
    activeDate: PropTypes.object,
    setActiveDate: PropTypes.func,
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
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleOutsideClick);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleOutsideClick);
  }

  handleOutsideClick = (event) => {
    const el = ReactDOM.findDOMNode(this.refs.datepicker);

    if (!el.contains(event.target)) {
      this.props.hideDatepicker();
    }
  };

  render() {
    return (
      <div className="datepicker" ref="datepicker">
        <Calendar
          date={this.props.date}
          setDate={this.props.setDate}
          activeDate={this.props.activeDate}
          setActiveDate={this.props.setActiveDate}
        />
        <div className="hours row-fluid">
          <div className="input-group">
            <div className="input-group-addon">
              <i className="fa fa-clock-o"/>
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
                big
                action={this.props.onResetClick}
              />
            </div>
          </div>
        </div>
        <Controls grouped noControls>
          <Control
            label="24h"
            btnStyle="default"
            big
            action={this.props.on24hClick}
          />
          <Control
            label="All"
            btnStyle="default"
            big
            action={this.props.onAllClick}
          />
        </Controls>
        <button
          className="btn btn-primary pull-right"
          onClick={this.props.onApplyClick}
        >Apply
        </button>
      </div>
    );
  }
}
