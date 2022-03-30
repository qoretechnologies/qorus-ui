/* @flow */
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import updateOnlyForKeys from 'recompose/onlyUpdateForKeys';
import ResizeObserver from 'resize-observer-polyfill';

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
  active?: boolean,
};

@updateOnlyForKeys(['children', 'className', 'sortData', 'highlight', 'first'])
export default class Tr extends Component {
  props: Props = this.props;

  state: {
    // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    highlight: ?boolean,
  } = {
    highlight: false,
  };

  componentDidMount () {
    this.startHighlight(this.props.highlight);
  }

  componentWillReceiveProps (nextProps: Object): void {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'highlight' does not exist on type 'Objec... Remove this comment to see the full error message
    this.startHighlight(nextProps.highlight);
  }

  componentWillUnmount () {
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
        const ro = new ResizeObserver((entries, observer) => {
          for (const entry of entries) {
            this.recalculateSizes();
          }
        });

        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'Element | Text' is not assignabl... Remove this comment to see the full error message
        ro.observe(findDOMNode(ref));
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
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'cells' does not exist on type 'Element |... Remove this comment to see the full error message
        const bodyCells = Array.from(node.cells);

        if (node && node.parentElement) {
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
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'getBoundingClientRect' does not exist on... Remove this comment to see the full error message
                    let { width } = bodyCells[newIndex].getBoundingClientRect();

                    // * Check if the cell has the data-colspan attr
                    // * If it has, it means we need to stretch the cell by the width
                    // * of the number of leading columns
                    // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
                    let colspan: ?number = cell.getAttribute('data-colspan');

                    if (colspan) {
                      // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
                      colspan = parseInt(colspan, 10);
                      // * Calculate the width of this cell by going through
                      // * the forward cells to the length of the colspan
                      width = bodyCells.reduce(
                        (newWidth: number, bCell: any, idx: number): number => {
                          if (
                            idx >= newIndex &&
                            idx <= newIndex + colspan - 1
                          ) {
                            return (
                              newWidth + bCell.getBoundingClientRect().width
                            );
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
        }

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

  render () {
    const {
      children,
      className,
      sortData,
      onSortChange,
      title,
      active,
    } = this.props;
    const { highlight } = this.state;

    return (
      <tr
        className={classNames(
          {
            'row-highlight': highlight,
            'row-active': active,
          },
          className
        )}
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message
        onClick={this.handleClick}
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'LegacyR... Remove this comment to see the full error message
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
