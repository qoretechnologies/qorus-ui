/* @flow */
import React, { Component } from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import withHandlers from 'recompose/withHandlers';
import updateOnlyForKeys from 'recompose/onlyUpdateForKeys';
import classNames from 'classnames';

type Props = {
  children?: any,
  name?: string,
  className?: string,
  colspan?: number,
  handleClick: Function,
  direction: number,
  onSortChange?: Function,
  onClick?: Function,
  sortData?: Object,
  fixed?: boolean,
}

class Th extends Component {
  props: Props;

  state: {
    width: ?number,
  } = {
    width: null,
  };

  componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.fixed !== this.props.fixed && !nextProps.fixed) {
      this.setWidth();
    }
  }

  _col: ?HTMLElement = null;

  handleRef: Function = (ref: Object): void => {
    this._col = ref;

    this.setWidth();
  };

  setWidth: Function = () => {
    if (this._col) {
      const { width } = this._col.getBoundingClientRect();

      this.setState({ width });
    }
  }

  render() {
    const { direction, handleClick, children, className } = this.props;
    const { width } = this.state;

    return (
      <th
        ref={this.handleRef}
        className={
          classNames({
            sort: direction,
            'sort-asc': direction && direction > 0,
            'sort-desc': direction && direction < 0,
          }, className)
        }
        style={{
          width,
        }}
        onClick={handleClick}
      >
        { children }
      </th>
    );
  }
}

export default compose(
  withHandlers({
    handleClick: ({ onSortChange, onClick, name }: Props) => () => {
      if (name) {
        if (onSortChange) onSortChange({ sortBy: name });
        if (onClick) onClick();
      }
    },
  }),
  mapProps(({ sortData, name, ...rest }: Props) => ({
    direction: sortData && sortData.sortBy === name ? sortData.sortByKey.direction : null,
    ...rest,
  })),
  updateOnlyForKeys([
    'children',
    'className',
    'sortData',
    'direction',
    'fixed',
  ])
)(Th);
