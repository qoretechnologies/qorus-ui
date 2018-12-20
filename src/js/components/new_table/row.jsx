/* @flow */
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import updateOnlyForKeys from 'recompose/onlyUpdateForKeys';
import withMutationObserver from '../../hocomponents/withMutationObserver';

type Props = {
  children?: any,
  className?: string,
  sortData?: Object,
  onSortChange?: Function,
  highlight?: boolean,
  onHighlightEnd?: Function,
  onClick?: Function,
  first?: boolean,
  title?: string,
  key?: any,
  lastObserverChange?: string | number,
  observeElement?: ?string,
};

@withMutationObserver('.sidebar')
@withMutationObserver(({ observeElement }) => observeElement)
@updateOnlyForKeys([
  'children',
  'className',
  'sortData',
  'highlight',
  'first',
  'lastObserverChange',
  'observeElement',
])
export default class Tr extends Component {
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

    if (
      nextProps.first &&
      this.props.lastObserverChange !== nextProps.lastObserverChange
    ) {
      this.recalculateSizes();
    }
  }

  componentDidUpdate() {
    this.recalculateSizes();
  }

  componentWillUnmount() {
    clearTimeout(this._highlightTimeout);

    if (this.props.onHighlightEnd && this.props.highlight) {
      this.props.onHighlightEnd();
    }

    window.removeEventListener('resize', this.recalculateSizes);
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
      }
    }
  };

  handleClick: Function = (event: Object): void => {
    if (this.props.onClick) {
      this.props.onClick(event);
    }
  };

  recalculateSizes: Function = (): void => {
    if (this.props.first && this._el) {
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
        const headers = parent.querySelectorAll(
          '.table-header-wrapper .table-fixed-row'
        );
        const headerWrapper = parent.querySelectorAll(
          'div.table-header-wrapper'
        );

        headerWrapper[0].setAttribute('style', 'width: 100% !important');

        headers.forEach(
          (header: any): void => {
            const headCells = header.querySelectorAll('.fixed-table-header');

            if (headCells.length === 1) {
              headCells[0].setAttribute('style', 'width: 100% !important');
            } else {
              // * this tells us if we need to increment the current index because of a colspan
              let colspanIncrementer: number = 0;

              headCells.forEach(
                (cell: any, index: number): void => {
                  // * Create the current bodycell index by adding the index + any colspan
                  const newIndex: number = index + colspanIncrementer;
                  let { width } = bodyCells[newIndex].getBoundingClientRect();

                  // * Check if the cell has the data-colspan attr
                  // * If it has, it means we need to stretch the cell by the width
                  // * of the number of leading columns
                  let colspan: ?number = cell.getAttribute('data-colspan');

                  if (colspan) {
                    colspan = parseInt(colspan, 10);
                    // * Calculate the width of this cell by going through
                    // * the forward cells to the length of the colspan
                    width = bodyCells.reduce(
                      (newWidth: number, bCell: any, idx: number): number => {
                        if (idx >= newIndex && idx <= newIndex + colspan - 1) {
                          return newWidth + bCell.getBoundingClientRect().width;
                        }

                        return newWidth + 0;
                      },
                      0
                    );

                    colspanIncrementer = colspanIncrementer + colspan - 1;
                  }

                  cell.setAttribute('style', `width: ${width}px !important`);
                }
              );
            }
          }
        );

        this._resizeTimeout = null;
      }, 1);
    }
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
    const { children, className, sortData, onSortChange, title } = this.props;
    const { highlight } = this.state;

    return (
      <tr
        className={classNames(className, {
          'row-highlight': highlight,
        })}
        onClick={this.handleClick}
        ref={this.handleRef}
        title={title}
      >
        {sortData && onSortChange
          ? React.Children.map(children, (child: any, key) =>
              child
                ? React.cloneElement(child, { key, sortData, onSortChange })
                : undefined
            )
          : children}
      </tr>
    );
  }
}
