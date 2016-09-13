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
  };

  /**
   * Hides the dropdown and runs
   * provided function
   * @params {Object} - browser Event
   */
  handleClick: Function = (event: Object): void => {
    if (this.props.action) {
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
    const { className = '', selected, title } = this.props;
    const cls = classNames({
      active: selected,
      [className]: className,
    });

    return (
      <li className={cls}>
        <a
          onClick={this.handleClick}
          href="#"
        >
          {this.renderIcon()}
          {' '}
          {title}
        </a>
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
