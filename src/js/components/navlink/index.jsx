import React, { Component, PropTypes } from 'react';

export default class Nav extends Component {
  static propTypes = {
    path: PropTypes.string,
    children: PropTypes.node,
    type: PropTypes.string,
  };

  renderChildren() {
    return React.Children.map(this.props.children, (c) => (
      <c.type
        {...c.props}
        path={this.props.path}
      />
    ));
  }

  render() {
    const cls = this.props.type || 'nav-tabs';

    return (
      <ul className={`nav ${cls}`}>
        { this.renderChildren() }
      </ul>
    );
  }
}

export NavLink from './link';
