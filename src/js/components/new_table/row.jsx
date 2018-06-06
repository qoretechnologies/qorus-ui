/* @flow */
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import updateOnlyForKeys from 'recompose/onlyUpdateForKeys';

type Props = {
  children?: any,
  className?: string,
  sortData?: Object,
  onSortChange?: Function,
  highlight?: boolean,
  onHighlightEnd?: Function,
  onClick?: Function,
  first?: boolean,
};

@updateOnlyForKeys(['children', 'className', 'sortData', 'highlight', 'first'])
export default class Row extends Component {
  props: Props;

  state: {
    highlight: ?boolean,
  } = {
    highlight: false,
  };

  componentDidMount() {
    this.startHighlight(this.props.highlight);
  }

  componentWillReceiveProps(nextProps: Object): void {
    this.startHighlight(nextProps.highlight);
  }

  componentDidUpdate() {
    this.recalculateSizes();
  }

  componentWillUnmount() {
    clearTimeout(this._highlightTimeout);

    if (this.props.onHighlightEnd && this.props.highlight) {
      this.props.onHighlightEnd();
    }
  }

  _el: any;
  _resizeTimeout: any;
  _highlightTimeout: any;

  handleRef: Function = (ref: any): void => {
    if (ref) {
      this._el = ref;

      if (this.props.first) {
        this.recalculateSizes();
        window.addEventListener('resize', this.recalculateSizes);
        document
          .querySelector('#content-wrapper')
          .addEventListener('resize', this.recalculateSizes);
      }
    }
  };

  recalculateSizes: Function = (): void => {
    if (this._resizeTimeout) {
      this._resizeTimeout = null;

      clearTimeout(this._resizeTimeout);
    }

    this._resizeTimeout = setTimeout(() => {
      const ref = this._el;
      const node = findDOMNode(ref);
      const bodyCells = Array.from(node.cells);
      const parent =
        node.parentElement.parentElement.parentElement.parentElement;
      const headCells = parent.querySelectorAll(
        '.table-header-wrapper .fixed-table-header'
      );
      const footCells = parent.querySelectorAll(
        '.table-footer-wrapper .fixed-table-header'
      );
      const headerWrapper = parent.querySelectorAll('div.table-header-wrapper');
      const footerWrapper = parent.querySelectorAll('div.table-footer-wrapper');
      const { width: rowWidth } = ref.getBoundingClientRect();

      headerWrapper[0].setAttribute('style', `width: ${rowWidth}px !important`);

      if (footerWrapper.length) {
        footerWrapper[0].setAttribute(
          'style',
          `width: ${rowWidth}px !important`
        );
      }

      bodyCells.forEach(
        (cell: any, index: number): void => {
          const { width } = cell.getBoundingClientRect();

          headCells[index].setAttribute(
            'style',
            `width: ${width}px !important`
          );

          if (footCells.length) {
            footCells[index].setAttribute(
              'style',
              `width: ${width}px !important`
            );
          }
        }
      );

      this._resizeTimeout = null;
    }, 500);
  };

  startHighlight: Function = (highlight: boolean): void => {
    if (highlight && !this._highlightTimeout) {
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
    const { children, className, sortData, onSortChange, onClick } = this.props;
    const { highlight } = this.state;

    return (
      <tr
        className={classNames(
          {
            'row-highlight': highlight,
          },
          className
        )}
        onClick={onClick}
        ref={this.handleRef}
      >
        {sortData && onSortChange
          ? React.Children.map(
              children,
              (child: any, key) =>
                child
                  ? React.cloneElement(child, { key, sortData, onSortChange })
                  : undefined
            )
          : children}
      </tr>
    );
  }
}
