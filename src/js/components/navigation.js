import React, { Component, PropTypes} from 'react';
import Link from 'react-router';
import clNs from 'classnames';


class NavItem extends Component {
  static propTypes = {
    url:       PropTypes.string.isRequired,
    name:      PropTypes.string.isRequired,
    className: PropTypes.string
  }

  static defaultProps = {
    className: ''
  }

  render () {
    let { url, span, icon } = this.props;
    let cls = clNs("icon-large", icon, className);

    return (
      <li>
        <Link to={ url }><i className={ cls }></i><span>{ name }</span></Link>
      </li>
    )
  }
}


class Navigation extends Component {
  static propTypes = {
    mainItems: PropTypes.array,
    extraItems: PropTypes.array
  }

  static defaultProps = {
    mainItems: [],
    extraItems: []
  }

  render () {
    let { mainItems, extraItems } = this.props;

    let navItems = mainItems.forEach((item) => {
      let { url, icon, className } = item;
      return <NavItem url={ url } icon={ icon } className={ className } />;
    });

    console.log(mainItems, navItems);

    return (
      <aside className="affix navigation">
        <nav id="nav-main">
          <ul className="nav nav-list main">
            { navItems }
          </ul>
          <ul className="extra" />
        </nav>
      </aside>
    )
  }
}

export default Navigation = Navigation;
