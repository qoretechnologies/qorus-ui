import React, { Component, PropTypes } from 'react';
import { Control as Button } from 'components/controls';
import Toolbar from 'components/toolbar';

import { omit } from 'lodash';

export default class SearchToolbar extends Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    id: PropTypes.string,
    keyvalue: PropTypes.string,
    status: PropTypes.string,
    date: PropTypes.string,
  };

  componentWillMount() {
    this.setState({
      advanced: false,
    });

    this.setUp(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.id !== nextProps.id ||
        this.props.keyvalue !== nextProps.keyvalue ||
        this.props.status !== nextProps.status ||
        this.props.date !== nextProps.date) {
      this.setUp(nextProps);
    }
  }

  setUp(props) {
    this.setState({
      id: props.id,
      keyvalue: props.keyvalue,
      status: props.status,
      date: props.date,
    });
  }

  handleInputChange = (type) => (event) => {
    this.setState({
      [type]: event.target.value,
    });
  };

  handleSwitchClick = () => {
    this.setState({
      advanced: !this.state.advanced,
    });
  };

  handleFormSubmit = (event) => {
    event.preventDefault();

    this.props.onSubmit(omit(this.state, 'advanced'));
  };

  renderToolbar() {
    if (this.state.advanced) return <div></div>;

    return (
      <div>
        <div className="form-group">
          <input
            className="form-control"
            type="text"
            placeholder="Instance ID..."
            onChange={this.handleInputChange('id')}
            value={this.state.id || ''}
          />
        </div>
        {' '}
        <div className="form-group">
          <input
            className="form-control"
            type="text"
            placeholder="Key/Value"
            onChange={this.handleInputChange('keyvalue')}
            value={this.state.keyvalue || ''}
          />
        </div>
        {' '}
        <div className="form-group">
          <Button
            type="submit"
            icon="search"
            btnStyle="success"
            big
          />
        </div>
      </div>
    );
  }

  render() {
    return (
      <Toolbar>
        <form
          className="form-inline pull-left"
          onSubmit={this.handleFormSubmit}
        >
          { this.renderToolbar() }
        </form>
        <div className="pull-right">
          <Button
            label={this.state.advanced ? 'Simple search' : 'Advanced search'}
            btnStyle="default"
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
