import React, { Component, PropTypes} from 'react';
import { Link } from 'react-router';
import clNs from 'classnames';
import pureRender from 'pure-render-decorator';

class NavItem extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    icon: PropTypes.string
  }

  static defaultProps = {
    className: ''
  }

  render() {
    const { url, className, icon, name } = this.props;
    const cls = clNs('fa fa-2x fa-large', icon);

    return (
      <li className={ className }>
        <Link to={ url }><i className={ cls }></i><span>{ name }</span></Link>
      </li>
    );
  }
}

@pureRender
class Navigation extends Component {
  static propTypes = {
    mainItems: PropTypes.array,
    extraItems: PropTypes.array
  }

  static defaultProps = {
    mainItems: [],
    extraItems: []
  }

  render() {
    const { mainItems, extraItems } = this.props;

    const navItems = mainItems.map(item => {
      return <NavItem {...item} key={ item.name } />;
    });

    const navExtraItems = extraItems.map(item => {
      return <NavItem {...item} key={ item.name } />;
    });

    return (
      <aside className='affix navigation'>
        <nav id='nav-main'>
          <ul className='nav nav-list main'>
            { navItems }
          </ul>
          <ul className='extra'>
            { navExtraItems }
          </ul>
        </nav>
      </aside>
    );
  }
}

export default Navigation = Navigation;
