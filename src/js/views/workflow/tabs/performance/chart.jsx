import React, { Component, PropTypes } from 'react';
import { Control as Button } from 'components/controls';

import Loader from 'components/loader';
import Chart from 'components/chart';

import { DATASETS } from 'constants/orders';

import classNames from 'classnames';
import { fetchJson } from 'store/api/utils';
import { range, values } from 'lodash';
import moment from 'moment';

export default class extends Component {
  static propTypes = {
    days: PropTypes.number,
  };

  componentWillMount() {
    this.fetchData(this.props.days);

    this.setState({
      days: this.props.days,
      editing: false,
      value: null,
      labels: [],
      datasets: [],
    });
  }

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

  handleSubmit = (event) => {
    event.preventDefault();

    if (!/^-?\d+$/.test(this.state.value)) {
      this.setState({
        error: true,
      });
    } else {
      this.setState({
        days: this.state.value,
        editing: false,
      });

      this.fetchData(this.state.value);
    }
  };

  handleInputChange = (event) => {
    this.setState({
      value: event.target.value,
    });
  };

  fetchData = async (days) => {
    const data = await fetchJson(
      'GET',
      '/api/orders?action=processingSummary'
    );

    const rng = days > 1 ? range(days) : range(24);
    const type = days > 1 ? 'days' : 'hours';
    const format = days > 1 ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH';

    const labels = rng.map(r => moment().add(-r, type).format(format));
    const dt = [];

    labels.forEach(l => {
      const m = data.find(d => d.grouping === l);

      DATASETS.forEach(ds => {
        dt[ds] = dt[ds] || { data: [], label: ds };

        if (m) {
          dt[ds].data.push(m[ds]);
        } else {
          dt[ds].data.push(0);
        }
      });
    });

    const lbs = labels.map(lb => lb.slice(-2));

    this.setState({
      labels: lbs.reverse(),
      datasets: values(dt),
    });
  };

  renderHeader() {
    if (this.state.editing) {
      const css = classNames('form-control', this.state.error ? 'form-error' : '');

      return (
        <form onSubmit={this.handleSubmit}>
          <div className="input-group col-sm-2">
            <input
              type="number"
              min="1"
              max="90"
              className={css}
              defaultValue={this.state.days}
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

    return (
      <h3 onClick={this.handleHeaderClick}> Last { this.state.days } days </h3>
    );
  }

  render() {
    if (!this.state.labels.length) {
      return <Loader />;
    }

    console.log(this.state.labels);

    return (
      <div>
        { this.renderHeader() }
        <Chart
          type="line"
          id="test"
          width={600}
          height={200}
          yAxisLabel="Time in 1 sec"
          xAxisLabel="Hour/Day [orders processed]"
          labels={this.state.labels}
          datasets={this.state.datasets}
        />
      </div>
    );
  }
}
