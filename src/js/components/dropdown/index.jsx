import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Item from './item';
import CustomItem from './custom_item';
import Control from './control';
import { Control as Button } from '../controls';

import classNames from 'classnames';
import { pureRender } from '../utils';
import { includes, remove, xor } from 'lodash';

type Props = {
  children?: Array<React.Element<any>>,
  id: string,
  multi?: boolean,
  def?: string,
  selectedIcon?: string,
  onSubmit?: () => void,
  submitLabel?: string,
  selected?: Array<?string>,
  show?: ?boolean,
}

@pureRender
export default class Dropdown extends Component {
  static defaultProps = {
    selectedIcon: 'check-square-o',
    submitLabel: 'Filter',
  };

  props: Props;

  state: {
    showDropdown: ?boolean,
    selected: Array<*>,
  };

  state = {
    showDropdown: this.props.show,
    selected: this.props.selected || [(this.props.def: ?string)],
  };

  componentWillReceiveProps(nextProps: Props): void {
    if (this.state.showDropdown !== nextProps.show) {
      this.setState({
        showDropdown: nextProps.show,
      });
    }
  }

  componentDidUpdate(): void {
    document.removeEventListener('click', this.handleOutsideClick);

    if (this.state.showDropdown) {
      document.addEventListener('click', this.handleOutsideClick);
    }
  }

  getToggleTitle: Function = (children: any): ?string => {
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
   * Toggles the items selection in the
   * multi select dropdown. The def prop is
   * selected by default and if no other
   * item is selected.
   *
   * @param {String} item
   */
  toggleItem: Function = (item: string): void => {
    let selected: Array<?string> = this.state.selected.slice();

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

  handleOutsideClick: Function = (event: Object): void => {
    const el: Object = ReactDOM.findDOMNode(this.refs.dropdown);

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
  handleToggleClick: Function = (event: Object): void => {
    if (!event.defaultPrevented) {
      event.preventDefault();

      this.setState({
        showDropdown: !this.state.showDropdown,
      });
    }
  };

  handleSubmit: Function = (): void => {
    if (this.props.onSubmit) {
      this.props.onSubmit(this.state.selected);
      this.hideToggle();
    }
  };

  /**
   * Hides the control dropdown
   * based on the current state
   */
  hideToggle: Function = (): void => {
    this.setState({
      showDropdown: false,
    });
  };

  /**
   * Renders the seleciton dropdown to the component
   */
  renderDropdown(): ?React.Element<any> {
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

  renderDropdownList(): ?React.Element<any> {
    return React.Children.map(this.props.children, (c) => {
      if (c.type !== Item && c.type !== CustomItem) return undefined;

      if (c.type === CustomItem) {
        return c;
      }

      let selected: boolean = false;
      let icon: ?string = c.props.icon;

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

  renderDropdownControl(): ?React.Element<any> {
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

  renderSubmit(): ?React.Element<Button> {
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

  render(): React.Element<any> {
    return (
      <div className="btn-group">
        {this.renderDropdownControl()}
        {this.renderDropdown()}
        {this.renderSubmit()}
      </div>
    );
  }
}

Dropdown.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string,
  multi: PropTypes.bool,
  def: PropTypes.string,
  selectedIcon: PropTypes.string,
  onSubmit: PropTypes.func,
  submitLabel: PropTypes.string,
  selected: PropTypes.array,
};

export {
  Item,
  CustomItem,
  Control,
};

