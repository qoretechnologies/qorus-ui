/* @flow */
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { pureRender } from '../utils';

@pureRender
export default class Item extends Component {
  props: {
    title: string | number,
    icon?: string,
    action: () => void,
    hideDropdown?: () => void,
    multi?: boolean,
    selected?: boolean,
    toggleItem?: () => void,
    className?: string,
    marked: number,
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
    if (this.props.action && event) {
      this.props.action(event, this.props.title);
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
    const { className = '', selected, title, marked } = this.props;
    const cls = classNames({
      active: selected,
      marked,
      [className]: className,
    });

    return (
      <li className={cls}>
        <span
          className="dropdown-item"
          onClick={this.handleClick}
        >
          {this.renderIcon()}
          {' '}
          {title}
        </span>
      </li>
    );
  }
}

Item.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  className: PropTypes.string,
  icon: PropTypes.string,
  action: PropTypes.func,
  hideDropdown: PropTypes.func,
  multi: PropTypes.bool,
  selected: PropTypes.bool,
  toggleItem: PropTypes.func,
};
