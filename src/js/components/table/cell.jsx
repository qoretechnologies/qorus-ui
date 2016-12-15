import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { pureRender } from '../utils';

/**
 * Flexible table cell with pure render for improved performance.
 */
@pureRender
export default class Cell extends Component {
  static propTypes = {
    tag: PropTypes.oneOf(['td', 'th']),
    children: PropTypes.node,
    onSortChange: PropTypes.func,
    name: PropTypes.string,
    className: PropTypes.string,
    sortData: PropTypes.object,
    colspan: PropTypes.number,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    tag: 'td',
  };

  handleTagClick = () => {
    if (this.props.tag === 'th' && this.props.onSortChange) {
      this.props.onSortChange({ sortBy: this.props.name });
    }

    if (this.props.onClick) this.props.onClick();
  };

  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    const Tag = this.props.tag;
    let sortCss;

    if (this.props.sortData && this.props.sortData.sortBy === this.props.name) {
      sortCss = this.props.sortData.sortByKey.direction > 0 ? 'sort sort-asc' : 'sort sort-desc';
    }

    return (
      <Tag
        onClick={this.handleTagClick}
        className={classNames(this.props.className, sortCss)}
        colSpan={this.props.colspan}
      >
        { React.Children.toArray(this.props.children) }
      </Tag>
    );
  }
}
