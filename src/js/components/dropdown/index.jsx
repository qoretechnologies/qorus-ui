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
  onSelect?: () => Array<string>,
  submitLabel?: string,
  selected?: Array<?string>,
  show?: ?boolean,
  className?: string,
  diabled?: boolean,
  onHide?: Function,
};

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
    marked: number,
  };

  componentWillMount(): void {
    let sel;
    const { selected, def } = this.props;

    if (this.props.selected) {
      sel = selected;
    } else {
      sel = def ? [def] : [];
    }

    this.setState({
      showDropdown: this.props.show,
      selected: sel,
      marked: 1,
    });
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (this.state.showDropdown !== nextProps.show) {
      this.setState({
        showDropdown: nextProps.show,
      });
    }
  }

  componentDidUpdate(): void {
    document.removeEventListener('click', this.handleOutsideClick);
    document.removeEventListener('keyup', this.handleMarkedChange);

    if (this.state.showDropdown) {
      document.addEventListener('click', this.handleOutsideClick);
      document.addEventListener('keyup', this.handleMarkedChange);
    }
  }

  componentWillUnmount(): void {
    document.removeEventListener('click', this.handleOutsideClick);
    document.removeEventListener('keyup', this.handleMarkedChange);
  }

  getToggleTitle: Function = (children: any): ?string => {
    if (this.props.multi) {
      const length = this.state.selected.length;
      if (length === 0) {
        return children || 'Please select';
      }

      return length > 3 ? `${length} selected` : this.state.selected.join(', ');
    }

    if (children) {
      return children;
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
      selected = this.props.def ? [this.props.def] : [];
    }

    this.setState({
      selected,
    });

    if (this.props.onSelect) this.props.onSelect(selected);
  };

  handleOutsideClick: Function = (event: Object): void => {
    const el: Object = ReactDOM.findDOMNode(this.refs.dropdown);

    if (el && !el.contains(event.target)) {
      this.hideToggle();
    }
  };

  handleMarkedChange: Function = (event: EventHandler): void => {
    const { which } = event;
    const { marked } = this.state;
    const items = React.Children.count(this.props.children) - 1;
    let newPos;

    if (which === 40 || which === 38) {
      if (which === 40) {
        newPos = marked + 1;

        if (newPos > items) {
          newPos = 1;
        }
      } else if (which === 38) {
        newPos = marked - 1;

        if (newPos === 0) {
          newPos = items;
        }
      }

      this.setState({
        marked: newPos,
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

      const showDropdown = !this.state.showDropdown;

      if (!showDropdown && this.props.onHide) {
        this.props.onHide();
      }

      this.setState({ showDropdown });
    }
  };

  handleToggleKeyPress: Function = (event: EventHandler): void => {
    if (event.which === 13) {
      event.preventDefault();
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
    if (this.props.onHide) this.props.onHide();

    this.setState({
      showDropdown: false,
    });
  };

  /**
   * Renders the seleciton dropdown to the component
   */
  renderDropdown(): ?React.Element<any> {
    if (this.state.showDropdown && !this.props.disabled) {
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
    return React.Children.map(this.props.children, (c, index) => {
      if (!c || (c.type !== Item && c.type !== CustomItem)) return null;

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
          {...c.props}
          marked={index === this.state.marked}
          selected={selected}
          toggleItem={this.toggleItem}
          hideDropdown={this.hideToggle}
          multi={this.props.multi}
          icon={icon}
        />
      );
    });
  }

  renderDropdownControl(): ?React.Element<any> {
    return React.Children.map(this.props.children, (c) => {
      if (!c || c.type !== Control) return undefined;

      return (
        <c.type
          id={this.props.id}
          onClick={this.handleToggleClick}
          onKeyPress={this.handleToggleKeyPress}
          disabled={this.props.disabled}
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
      <div className={classNames('btn-group', this.props.className)}>
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
  disabled: PropTypes.bool,
  onHide: PropTypes.func,
};

export {
  Item,
  CustomItem,
  Control,
};
