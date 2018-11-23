import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import pure from 'recompose/onlyUpdateForKeys';

import Item from './item';
import CustomItem from './custom_item';
import Control from './control';
import {
  Menu,
  Popover,
  Position,
  Button as Btn,
  ButtonGroup,
} from '@blueprintjs/core';

import { includes, remove, xor } from 'lodash';

type Props = {
  children?: Array<React.Element<any>>,
  id: string,
  multi?: boolean,
  def?: string,
  selectedIcon?: string,
  deselectedIcon?: string,
  onSubmit?: () => void,
  onSelect?: () => Array<string>,
  submitLabel?: string,
  selected?: Array<?string>,
  show?: ?boolean,
  className?: string,
  disabled?: boolean,
  onHide?: Function,
};

@pure(['children', 'show', 'selected', 'disabled', 'className'])
export default class Dropdown extends Component {
  static defaultProps = {
    selectedIcon: 'selection',
    deselectedIcon: 'circle',
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

    if (this.state.selected !== nextProps.selected && nextProps.selected) {
      this.setState({
        selected: nextProps.selected,
      });
    }
  }

  componentWillUnmount(): void {
    document.removeEventListener('keyup', this.handleMarkedChange);
  }

  handleOpen: Function = () => {
    document.addEventListener('keyup', this.handleMarkedChange);
  };

  getToggleTitle: Function = (children: any): ?string => {
    if (this.props.multi) {
      const { selected } = this.state;

      if (!selected || selected.length === 0) {
        return children || 'Please select';
      }

      return selected.length > 3
        ? `${selected.length} selected`
        : selected.join(', ');
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

    if (
      !selected.length ||
      (item === this.props.def && !includes(this.state.selected, item))
    ) {
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
    if (
      !this.props.disabled &&
      React.Children.toArray(this.props.children).length > 1
    ) {
      return <Menu>{this.renderDropdownList()}</Menu>;
    }

    return null;
  }

  renderDropdownList(): ?React.Element<any> {
    return React.Children.map(this.props.children, (c, index) => {
      if (!c || c.type === Control) return null;

      if (c.type === CustomItem) {
        return c;
      }

      let selected: boolean = false;
      let icon: ?string = c.props.icon;

      if (this.props.multi) {
        if (includes(this.state.selected, c.props.title)) {
          selected = true;
          icon = this.props.selectedIcon;
        } else {
          icon = this.props.deselectedIcon;
        }
      }

      return (
        <c.type
          {...c.props}
          marked={index === this.state.marked}
          selected={selected}
          toggleItem={this.toggleItem}
          hideDropdown={this.hideToggle}
          multi={this.props.multi}
          iconName={icon}
        />
      );
    });
  }

  renderDropdownControl(): ?React.Element<any> {
    return React.Children.map(this.props.children, c => {
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

  renderSubmit(): ?React.Element<Btn> {
    if (this.props.multi && this.props.onSubmit) {
      return <Btn text={this.props.submitLabel} onClick={this.handleSubmit} />;
    }

    return undefined;
  }

  render(): React.Element<any> {
    return (
      <ButtonGroup className={`${this.props.className} qorus-dropdown`}>
        <Popover
          position={Position.BOTTOM}
          content={this.renderDropdown()}
          popoverDidOpen={this.handleOpen}
          popoverClassName="popover-dropdown"
          isOpen={this.state.showDropdown}
          enforceFocus={false}
          autoFocus={false}
          onInteraction={inter => !inter && this.hideToggle()}
        >
          {this.renderDropdownControl()}
        </Popover>
        {this.renderSubmit()}
      </ButtonGroup>
    );
  }
}

export { Item, CustomItem, Control };
