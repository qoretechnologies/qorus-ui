import { InputGroup, Menu, Popover, PopoverPosition, Position } from '@blueprintjs/core';
import { includes, remove, xor } from 'lodash';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { compose } from 'recompose';
import pure from 'recompose/onlyUpdateForKeys';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Control as Button, Controls as ButtonGroup } from '../controls';
import Control from './control';
import CustomItem from './custom_item';
import Divider from './divider';
import Item from './item';

type Props = {
  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  children?: Array<React.Element<any>>;
  id: string;
  multi?: boolean;
  def?: string;
  selectedIcon?: string;
  deselectedIcon?: string;
  onSubmit?: () => void;
  onSelect?: () => Array<string>;
  submitLabel?: string;
  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  selected?: string[];
  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  show?: boolean;
  className?: string;
  disabled?: boolean;
  onHide?: Function;
  position?: PopoverPosition;
  alwaysShowSelectedCount?: boolean;
};

class Dropdown extends Component {
  static defaultProps = {
    selectedIcon: 'selection',
    deselectedIcon: 'circle',
    submitLabel: 'Filter',
  };

  props: Props = this.props;

  state: {
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    showDropdown: boolean;
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    selected: Array<any>;
    marked: number;
    filterValue: string;
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
      filterValue: '',
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
    // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
    document.removeEventListener('keyup', this.handleMarkedChange);
  }

  handleOpen: Function = () => {
    // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
    document.addEventListener('keyup', this.handleMarkedChange);
  };

  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  getToggleTitle: Function = (children: any): string => {
    if (this.props.multi) {
      const { selected } = this.state;

      if (!selected || selected.length === 0) {
        return children || 'Please select';
      }

      return selected.length > 3 || this.props.alwaysShowSelectedCount
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
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    let selected: string[] = this.state.selected.slice();

    if (item !== this.props.def) {
      remove(selected, (v) => v === this.props.def);
      selected = xor([item], selected);
    }

    if (!selected.length || (item === this.props.def && !includes(this.state.selected, item))) {
      selected = this.props.def ? [this.props.def] : [];
    }

    this.setState({
      selected,
    });

    // @ts-ignore ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
    if (this.props.onSelect) this.props.onSelect(selected);
  };

  // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
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
  handleToggleClick: Function = (event: any): void => {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'defaultPrevented' does not exist on type... Remove this comment to see the full error message
    if (!event.defaultPrevented) {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'preventDefault' does not exist on type '... Remove this comment to see the full error message
      event.preventDefault();

      const showDropdown = !this.state.showDropdown;

      if (!showDropdown && this.props.onHide) {
        this.props.onHide();
      }

      this.setState({ showDropdown });
    }
  };

  // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
  handleToggleKeyPress: Function = (event: EventHandler): void => {
    if (event.which === 13) {
      event.preventDefault();
    }
  };

  handleSubmit: Function = (): void => {
    if (this.props.onSubmit) {
      // @ts-ignore ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
      this.props.onSubmit(this.state.selected);
      this.hideToggle();
    }
  };

  handleFilterChange: Function = (event: any): void => {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'target' does not exist on type 'Object'.
    const { value } = event.target;

    this.setState({ filterValue: value });
  };

  handleFilterClearClick: Function = (): void => {
    this.setState({ filterValue: '' });
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
  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  renderDropdown() {
    const { filterValue } = this.state;

    if (!this.props.disabled && React.Children.toArray(this.props.children).length > 1) {
      return [
        <div className="dropdown-filter" key="dropdown-filter">
          <InputGroup
            className="bp3-fill"
            // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
            onChange={this.handleFilterChange}
            value={filterValue}
            rightElement={
              filterValue !== '' && (
                <Button
                  className="bp3-minimal"
                  icon="cross"
                  onClick={this.handleFilterClearClick}
                />
              )
            }
            placeholder={
              // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
              this.props.intl.formatMessage({ id: 'dropdown.filter' }) + '...'
            }
          />
        </div>,
        <Menu key="dropdown-menu" className="popover-dropdown">
          {this.renderDropdownList()}
        </Menu>,
      ];
    }

    return null;
  }

  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  renderDropdownList() {
    return React.Children.map(this.props.children, (c, index) => {
      if (!c || c.type.displayName === 'DropdownControl') return null;

      if (c.type === CustomItem || c.type === Divider) {
        return c;
      }

      const { filterValue } = this.state;

      if (filterValue !== '' && !c.props.title?.toLowerCase().includes(filterValue.toLowerCase())) {
        return null;
      }

      let selected: boolean = false;
      // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
      let icon: string = c.props.icon;

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
          icon={icon}
        />
      );
    });
  }

  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  renderDropdownControl() {
    return React.Children.map(this.props.children, (c) => {
      if (!c || c.type.displayName !== 'DropdownControl') return undefined;

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

  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  renderSubmit() {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'submitOnBlur' does not exist on type 'Pr... Remove this comment to see the full error message
    if (this.props.multi && this.props.onSubmit && !this.props.submitOnBlur) {
      return <Button text={this.props.submitLabel} onClick={this.handleSubmit} />;
    }

    return undefined;
  }

  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  render() {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'submitOnBlur' does not exist on type 'Pr... Remove this comment to see the full error message
    const { onSubmit, submitOnBlur } = this.props;

    return (
      <ButtonGroup
        className={`${this.props.className} qorus-dropdown`}
        style={{ verticalAlign: 'top' }}
      >
        <Popover
          position={this.props.position || Position.BOTTOM}
          content={this.renderDropdown() as any}
          // @ts-ignore FIXME
          popoverDidOpen={this.handleOpen}
          isOpen={this.state.showDropdown}
          enforceFocus={false}
          autoFocus={false}
          usePortal={false}
          onInteraction={(inter) => {
            if (!inter) {
              if (onSubmit && submitOnBlur) {
                // @ts-ignore ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
                onSubmit(this.state.selected);
              }

              this.hideToggle();
            }
          }}
        >
          {this.renderDropdownControl()}
        </Popover>
        {this.renderSubmit()}
      </ButtonGroup>
    );
  }
}

export default compose(
  injectIntl,
  pure(['children', 'show', 'selected', 'disabled', 'className'])
)(Dropdown);
export { Control, CustomItem, Divider, Item };

