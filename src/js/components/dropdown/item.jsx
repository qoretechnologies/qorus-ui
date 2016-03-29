import React, { Component, PropTypes } from 'react';

export default class Item extends Component {
  static propTypes = {
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  };

  render() {
    return (
      <li>
        <a href="#">{ this.props.title }</a>
      </li>
    );
  }
}
