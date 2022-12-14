/* @flow */
import { Icon, Intent, MenuItem } from '@blueprintjs/core';
import classNames from 'classnames';
import React, { Component } from 'react';
import { pureRender } from '../utils';

@pureRender
export default class Item extends Component {
  props: {
    title: any;
    icon?: string;
    action: () => void;
    onClick: () => void;
    hideDropdown?: () => void;
    multi?: boolean;
    selected?: boolean;
    toggleItem?: () => void;
    className?: string;
    marked: number;
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    intent: string;
    disabled?: boolean;
  } = this.props;

  componentDidMount() {
    this.setup();
  }

  componentDidUpdate() {
    this.setup();
  }

  componentWillUnmount() {
    // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
    document.removeEventListener('keypress', this.handleKeyPress);
  }

  handleClick: Function = (event: any): void => {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'preventDefault' does not exist on type '... Remove this comment to see the full error message
    event.preventDefault();

    this.action(event);
  };

  handleKeyPress: Function = (event: KeyboardEvent): void => {
    if (event.which === 13) {
      event.preventDefault();

      this.action(event);
    }
  };

  setup: Function = () => {
    // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
    document.removeEventListener('keypress', this.handleKeyPress);

    if (this.props.marked) {
      // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
      document.addEventListener('keypress', this.handleKeyPress);
    }
  };

  // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
  action: Function = (event: EventHandler): void => {
    const act = this.props.action || this.props.onClick;

    if (act && event) {
      // @ts-ignore ts-migrate(2554) FIXME: Expected 0 arguments, but got 2.
      act(event, this.props.title);
    }

    if (!this.props.multi) {
      if (this.props.hideDropdown) this.props.hideDropdown();
    } else {
      // @ts-ignore ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
      if (this.props.toggleItem) this.props.toggleItem(this.props.title);
    }
  };

  /**
   * Renders the icon for the dropdown item
   * @returns {ReactElement|Void}
   */
  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  renderIcon() {
    if (this.props.icon) {
      return <i className={classNames('fa', `fa-${this.props.icon}`)} />;
    }

    return null;
  }

  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  render() {
    const { selected, title, marked, multi, disabled, icon } = this.props;
    let intent = this.props.intent;

    if (marked) {
      intent = Intent.WARNING;
    } else if (selected) {
      intent = Intent.PRIMARY;
    }

    return (
      <MenuItem
        shouldDismissPopover={!multi}
        text={title}
        // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'IconName ... Remove this comment to see the full error message
        icon={icon}
        // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type '((event... Remove this comment to see the full error message
        onClick={this.handleClick}
        // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'Intent'.
        intent={intent}
        disabled={disabled}
        // @ts-ignore ts-migrate(2322) FIXME: Type 'Element' is not assignable to type 'string'.
        label={selected && <Icon icon="small-tick" />}
      />
    );
  }
}
