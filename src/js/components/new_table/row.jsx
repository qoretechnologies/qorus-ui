/* @flow */
import React, { Component } from 'react';
import classNames from 'classnames';
import updateOnlyForKeys from 'recompose/onlyUpdateForKeys';

type Props = {
  children?: any,
  className?: string,
  sortData?: Object,
  onSortChange?: Function,
  highlight?: boolean,
  onHighlightEnd?: Function,
}

@updateOnlyForKeys([
  'children',
  'className',
  'sortData',
  'highlight',
])
export default class Row extends Component {
  props: Props;

  state: {
    highlight: ?boolean,
  } = {
    highlight: this.props.highlight,
  };

  componentWillReceiveProps(nextProps: Object): void {
    this.startHighlight(nextProps.highlight);
  }

  componentWillUnmount() {
    clearTimeout(this._highlightTimeout);
    if (this.props.onHighlightEnd && this.props.highlight) this.props.onHighlightEnd();
  }

  _highlightTimeout = null;

  startHighlight: Function = (highlight: boolean): void => {
    if (highlight && !this._highlightTimeout) {
      clearTimeout(this._highlightTimeout);
      this._highlightTimeout = setTimeout(this.stopHighlight, 2500);

      this.setState({
        highlight: true,
      });
    }
  };

  stopHighlight: Function = (): void => {
    clearTimeout(this._highlightTimeout);
    this._highlightTimeout = null;

    this.setState({
      highlight: false,
    });

    if (this.props.onHighlightEnd) this.props.onHighlightEnd();
  };

  render() {
    const {
      children,
      className,
      sortData,
      onSortChange,
    } = this.props;
    const { highlight } = this.state;

    return (
      <tr
        className={classNames({
          'row-highlight': highlight,
        }, className)}
      >
        { sortData && onSortChange ? (
          React.Children.map(children, (child: any, key) => (
            child ? React.cloneElement(child, { key, sortData, onSortChange }) : undefined
          ))
        ) : (
          children
        )}
      </tr>
    );
  }
}
