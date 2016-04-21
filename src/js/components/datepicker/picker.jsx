import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { Controls, Control } from '../controls';

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
    children: PropTypes.node,
  };

  componentDidMount() {
    document.addEventListener('click', this.handleOutsideClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick);
  }

  handleOutsideClick = (event) => {
    const el = ReactDOM.findDOMNode(this.refs.datepicker);

    if (!el.contains(event.target)) {
      this.props.onResetClick();
      this.props.hideDatepicker();
    }
  };

  render() {
    return (
      <div className="datepicker" ref="datepicker">
        { this.props.children }
        <div className="hours row-fluid">
          <div className="input-group">
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
