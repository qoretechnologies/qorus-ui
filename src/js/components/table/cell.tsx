import classNames from 'classnames';
import React, { Component } from 'react';
import { pureRender } from '../utils';

/**
 * Flexible table cell with pure render for improved performance.
 */
@pureRender
export default class Cell extends Component {
  props: {
    tag: any;
    children: any;
    onSortChange: Function;
    name: string;
    className: string;
    sortData: Object;
    colspan: number;
    onClick: Function;
  } = this.props;

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

    // @ts-ignore ts-migrate(2339) FIXME: Property 'sortBy' does not exist on type 'Object'.
    if (this.props.sortData && this.props.sortData.sortBy === this.props.name) {
      sortCss =
        // @ts-ignore ts-migrate(2339) FIXME: Property 'sortByKey' does not exist on type 'Objec... Remove this comment to see the full error message
        this.props.sortData.sortByKey.direction > 0 ? 'sort sort-asc' : 'sort sort-desc';
    }

    return (
      <Tag
        onClick={this.handleTagClick}
        className={classNames(this.props.className, sortCss)}
        colSpan={this.props.colspan}
      >
        {React.Children.toArray(this.props.children)}
      </Tag>
    );
  }
}
