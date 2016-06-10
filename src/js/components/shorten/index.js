import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import classNames from 'classnames';


export default class Shorten extends Component {
  static propTypes = {
    extraClassname: PropTypes.string,
    children: PropTypes.node,
  }

  state = {
    showTooltip: false,
  }

  componentDidMount() {
    this.checkOverflow();
  }

  checkOverflow() {
    const el = ReactDOM.findDOMNode(this);

    if (el.offsetWidth < el.scrollWidth) {
      this.setState({ showTooltip: true });
    }
  }

  render() {
    if (!this.state.showTooltip) {
      return (
        <div className="relative">
          <div className={classNames('shorten', this.props.extraClassname)}>
            { this.props.children }
          </div>
        </div>
      );
    }

    return (
      <div className="relative shorten-wrapper">
        <div
          className={classNames('shorten', this.props.extraClassname)}
          dataTooltip={this.props.children}
          {...this.props}
        >
          { this.props.children }
        </div>
      </div>
    );
  }
}
