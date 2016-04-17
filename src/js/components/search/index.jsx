import React, { Component, PropTypes } from 'react';
import { pureRender } from '../utils';

@pureRender
export default class extends Component {
  static propTypes = {
    onUpdate: PropTypes.func,
    defaultValue: PropTypes.string,
  };

  componentWillMount() {
    this.setState({
      query: this.props.defaultValue,
    });
  }

  handleInputChange(event) {
    this.setState({
      query: event.target.value,
    });

    this.props.onUpdate(event.target.value);
  }

  render() {
    return (
      <div className="input-group col-lg-3 pull-right">
        <input
          type="text"
          className="form-control"
          onChange={::this.handleInputChange}
          value={this.state.query}
        />
        <span className="input-group-addon">
          <i className="fa fa-search" />
        </span>
      </div>
    );
  }
}
