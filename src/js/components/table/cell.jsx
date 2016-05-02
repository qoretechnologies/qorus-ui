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
  };

  static defaultProps = {
    tag: 'td',
  };

  componentWillMount() {
    this.setupSorting(this.props);
  }

  componentWillReceiveProps(next) {
    if (this.props.sortData !== next.sortData) {
      this.setupSorting(next);
    }
  }

  setupSorting = (props) => {
    let sortCss;

    if (props.sortData && props.sortData.sortBy === props.name) {
      sortCss = props.sortData.sortByKey > 0 ? 'sort sort-asc' : 'sort sort-desc';
    }

    this.setState({
      css: classNames(this.props.className, sortCss),
    });
  };

  handleTagClick = () => {
    if (this.props.tag === 'th') {
      this.props.onSortChange({ sortBy: this.props.name });
    }
  };

  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    const Tag = this.props.tag;

    return (
      <Tag
        onClick={this.handleTagClick}
        className={this.state.css}
      >
        { React.Children.toArray(this.props.children) }
      </Tag>
    );
  }
}
