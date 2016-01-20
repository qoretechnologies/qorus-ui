import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';


import { pureRender } from '../utils';
import UserInfo from '../userInfo';


/**
 * Display info about Qorus instance and logged in user.
 */
@pureRender
export default class Topbar extends Component {
  static propTypes = {
    info: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
  };


  componentWillMount() {
    this.setState({ expanded: false });
  }


  onToggleExpanded() {
    this.setState({ expanded: !this.state.expanded });
  }


  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    return (
      <nav className='navbar navbar-inverse navbar-fixed-top topbar'>
        <div className='container-fluid'>
          <div className='navbar-header'>
            <button
              type='button'
              className={classNames({
                'navbar-toggle': true,
                'collapsed': !this.state.expanded
              })}
              aria-expanded={this.state.expanded ? 'true' : 'false'}
              onClick={::this.onToggleExpanded}
            >
              <span className='sr-only'>Toggle navigation</span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
            </button>
            <div className='navbar-brand h2 topbar__instance'>
              {this.props.info['instance-key']}
            </div>
          </div>

          <div
            className={classNames({
              'navbar-collapse': true,
              'collapse': true,
              'in': this.state.expanded
            })}
            style={{ height: !this.state.expanded && '1px' }}
            aria-expanded={this.state.expanded ? 'true' : 'false'}
          >
            <UserInfo user={this.props.currentUser} />
          </div>
        </div>
      </nav>
    );
  }
}
