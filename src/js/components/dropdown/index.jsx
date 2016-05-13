import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Item from './item';
import Control from './control';
import { Control as Button } from '../controls';

import classNames from 'classnames';
import { pureRender } from '../utils';
import { includes, remove, xor } from 'lodash';

@pureRender
export default class extends Component {
  static propTypes = {
    children: PropTypes.node,
    id: PropTypes.string,
    multi: PropTypes.bool,
    def: PropTypes.string,
    selectedIcon: PropTypes.string,
    onSubmit: PropTypes.func,
    submitLabel: PropTypes.string,
  };

  static defaultProps = {
    selectedIcon: 'check-square-o',
    submitLabel: 'Filter',
  };

  componentWillMount() {
    this.setState({
      showDropdown: false,
      selected: [this.props.def],
    });
  }

  componentDidUpdate() {
    document.removeEventListener('click', this.handleOutsideClick);

    if (this.state.showDropdown) {
      document.addEventListener('click', this.handleOutsideClick);
    }
  }

  handleOutsideClick = (event) => {
    const el = ReactDOM.findDOMNode(this.refs.dropdown);

    if (el && !el.contains(event.target)) {
      this.setState({
        showDropdown: false,
      });
    }
  };

  /**
   * Displays / hides the control dropdown
   * based on the current state
   *
   * @param {Event} event
   */
  handleToggleClick = (event) => {
    if (event.defaultPrevented) return null;
    event.preventDefault();

    this.setState({
      showDropdown: !this.state.showDropdown,
    });
  };

  handleSubmit = () => {
    this.props.onSubmit(this.state.selected);
  };

  /**
   * Hides the control dropdown
   * based on the current state
   */
  hideToggle = () => {
    this.setState({
      showDropdown: false,
    });
  };

  /**
   * Toggles the items selection in the
   * multi select dropdown. The def prop is
   * selected by default and if no other
   * item is selected.
   *
   * @param {String} item
   */
  toggleItem = (item) => {
    let selected = this.state.selected.slice();

    if (item !== this.props.def) {
      remove(selected, v => v === this.props.def);
      selected = xor([item], selected);
    }

    if (!selected.length || (item === this.props.def && !includes(this.state.selected, item))) {
      selected = [this.props.def];
    }

    this.setState({
      selected,
    });
  };

  getToggleTitle = (children) => {
    if (children) {
      return children;
    }

    if (this.props.multi) {
      const length = this.state.selected.length;
      return length > 3 ? `${length} selected` : this.state.selected.join(', ');
    }

    return null;
  };

  /**
   * Renders the seleciton dropdown to the component
   */
  renderDropdown() {
    if (this.state.showDropdown) {
      return (
        <ul
          className={classNames('dropdown-menu', 'above', 'show')}
          id={`${this.props.id}-dropdown`}
          ref="dropdown"
        >
          { this.renderDropdownList() }
        </ul>
      );
    }

    return null;
  }

  renderDropdownList() {
    return React.Children.map(this.props.children, (c) => {
      if (c.type !== Item) return undefined;

      let selected = false;
      let icon = c.props.icon;

      if (includes(this.state.selected, c.props.title)) {
        selected = true;
        icon = this.props.selectedIcon;
      }

      return (
        <c.type
          selected={selected}
          toggleItem={this.toggleItem}
          hideDropdown={this.hideToggle}
          multi={this.props.multi}
          {...c.props}
          icon={icon}
        />
      );
    });
  }

  renderDropdownControl() {
    return React.Children.map(this.props.children, (c) => {
      if (c.type !== Control) return undefined;

      return (
        <c.type
          id={this.props.id}
          onClick={this.handleToggleClick}
          {...c.props}
        >
          {this.getToggleTitle(c.props.children)}
        </c.type>
      );
    });
  }

  renderSubmit() {
    if (this.props.multi && this.props.onSubmit) {
      return (
        <Button
          big
          btnStyle="info"
          label={this.props.submitLabel}
          action={this.handleSubmit}
        />
      );
    }

    return undefined;
  }

  render() {
    return (
      <div className="btn-group">
        {this.renderDropdownControl()}
        {this.renderDropdown()}
        {this.renderSubmit()}
      </div>
    );
  }
}

export {
  Item,
  Control,
};
