import React, { Component, PropTypes } from 'react';
import Item from './item';
import Control from './control';
import classNames from 'classnames';

export default class Dropdown extends Component {
  static propTypes = {
    children: PropTypes.node,
    id: PropTypes.string,
  };

  componentWillMount() {
    this.setState({
      showDropdown: false,
    });
  }

  /**
   * Displays / hides the control dropdown
   * based on the current state
   */
  onDropdownToggleClick() {
    this.setState({
      showDropdown: !this.state.showDropdown,
    });
  }

  /**
   * Hides the control dropdown
   * based on the current state
   */
  hideSelectionToggle() {
    this.setState({
      showDropdown: false,
    });
  }


  /**
   * Renders the seleciton dropdown to the component
   */
  renderDropdown() {
    if (this.state.showDropdown) {
      return (
        <ul
          className={classNames('dropdown-menu', 'above', 'show')}
          id={`${this.props.id}-dropdown`}
        >
          { this.renderDropdownList() }
        </ul>
      );
    }

    return null;
  }

  renderDropdownList() {
    return React.Children.map(this.props.children, (c) => {
      if (c.type === Item) {
        return c;
      }
    });
  }

  renderDropdownControl() {
    return React.Children.map(this.props.children, (c) => {
      if (c.type === Control) {
        return (
          <c.type
            id={this.props.id}
            onClick={::this.onDropdownToggleClick}
            onBlur={::this.hideSelectionToggle}
            {...c.props}
          />
        );
      }
    });
  }

  render() {
    return (
      <div className="btn-group">
        {this.renderDropdownControl()}
        {this.renderDropdown()}
      </div>
    );
  }
}

export { Item, Control };
