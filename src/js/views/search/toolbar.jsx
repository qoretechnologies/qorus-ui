import React, { Component, PropTypes } from 'react';
import { Control as Button } from 'components/controls';
import Toolbar from 'components/toolbar';
import DatePicker from 'components/datepicker';

import { omit, debounce } from 'lodash';

export default class SearchToolbar extends Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    ids: PropTypes.string,
    keyvalue: PropTypes.string,
    keyname: PropTypes.string,
    status: PropTypes.string,
    date: PropTypes.string,
    maxmodified: PropTypes.string,
  };

  componentWillMount() {
    this.delayedSearch = debounce((data) => {
      this.props.onSubmit(data);
    }, 280);

    this.setState({
      datetype: 'Modified',
    });

    this.setUp(this.props, {});
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.ids !== nextProps.ids ||
        this.props.keyvalue !== nextProps.keyvalue ||
        this.props.keyname !== nextProps.keyname ||
        this.props.status !== nextProps.status ||
        this.props.maxmodified !== nextProps.maxmodified ||
        this.props.date !== nextProps.date) {
      this.setUp(nextProps, this.state);
    }
  }

  setUp = (props, state) => {
    this.setState({
      ids: props.ids,
      keyvalue: props.keyvalue,
      keyname: props.keyname,
      status: props.status,
      date: props.date,
      maxmodified: props.maxmodified,
      advanced: state.advanced ||
                props.status ||
                props.date ||
                props.maxmodified,
    });
  };

  handleInputChange = (type) => (event) => {
    const state = {
      [type]: type === 'date' || type === 'maxmodified' ? event : event.target.value,
    };

    this.setState(state);
    this.delayedSearch(omit(Object.assign({}, this.state, state), ['advanced', 'datetype']));
  };

  handleSwitchClick = () => {
    this.setState({
      advanced: !this.state.advanced,
    });
  };

  renderAdvanced() {
    if (!this.state.advanced) return undefined;

    return (
      <div className="form-group">
        <div className="pull-left">
          <input
            className="form-control"
            type="text"
            placeholder="Status..."
            onChange={this.handleInputChange('status')}
            value={this.state.status || ''}
          />
        </div>
        <div className="pull-left">
          <DatePicker
            placeholder="Min date..."
            date={this.state.date}
            onApplyDate={this.handleInputChange('date')}
            submitOnBlur
            futureOnly
          />
          <DatePicker
            placeholder="Max date..."
            date={this.state.maxmodified}
            onApplyDate={this.handleInputChange('maxmodified')}
            submitOnBlur
            futureOnly
          />
        </div>
      </div>
    );
  }

  render() {
    return (
      <Toolbar>
        <div className="pull-left">
          <div className="form-group search-toolbar">
            <div className="pull-left">
              <input
                className="form-control"
                type="text"
                placeholder="Instance ID..."
                onChange={this.handleInputChange('ids')}
                value={this.state.ids || ''}
              />
            </div>
            <div className="pull-left">
              <input
                className="form-control"
                type="text"
                placeholder="Keyname"
                onChange={this.handleInputChange('keyname')}
                value={this.state.keyname || ''}
              />
            </div>
            <div className="pull-left">
              <input
                className="form-control"
                type="text"
                placeholder="Keyvalue"
                onChange={this.handleInputChange('keyvalue')}
                value={this.state.keyvalue || ''}
              />
            </div>
          </div>
          { this.renderAdvanced() }
        </div>
        <div className="pull-right">
          <Button
            label="Advanced search"
            icon={this.state.advanced ? 'check-square-o' : 'square-o'}
            btnStyle={this.state.advanced ? 'success' : 'default'}
            big
            action={this.handleSwitchClick}
          />
          <Button
            label="CSV"
            icon="copy"
            btnStyle="default"
            big
            action={this.handleCSVClick}
          />
        </div>
      </Toolbar>
    );
  }
}
