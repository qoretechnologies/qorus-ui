/* @flow */
import React, { Component } from 'react';
import classNames from 'classnames';
import { pureRender } from '../utils';
import { MenuItem, Intent } from '@blueprintjs/core';

@pureRender
export default class Item extends Component {
  props: {
    title: any,
    icon?: string,
    action: () => void,
    onClick: () => void,
    hideDropdown?: () => void,
    multi?: boolean,
    selected?: boolean,
    toggleItem?: () => void,
    className?: string,
    marked: number,
    intent: ?string,
  };

  componentDidMount() {
    this.setup();
  }

  componentDidUpdate() {
    this.setup();
  }

  componentWillUnmount() {
    document.removeEventListener('keypress', this.handleKeyPress);
  }

  handleClick: Function = (event: Object): void => {
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
    document.removeEventListener('keypress', this.handleKeyPress);

    if (this.props.marked) {
      document.addEventListener('keypress', this.handleKeyPress);
    }
  };

  action: Function = (event: EventHandler): void => {
    const act = this.props.action || this.props.onClick;

    if (act && event) {
      act(event, this.props.title);
    }

    if (!this.props.multi) {
      if (this.props.hideDropdown) this.props.hideDropdown();
    } else {
      if (this.props.toggleItem) this.props.toggleItem(this.props.title);
    }
  };

  /**
   * Renders the icon for the dropdown item
   * @returns {ReactElement|Void}
   */
  renderIcon(): ?React.Element<any> {
    if (this.props.icon) {
      return <i className={classNames('fa', `fa-${this.props.icon}`)} />;
    }

    return null;
  }

  render(): React.Element<any> {
    const { className = '', selected, title, marked, multi } = this.props;
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
        iconName={this.props.icon}
        onClick={this.handleClick}
        intent={intent}
      />
    );
  }
}
