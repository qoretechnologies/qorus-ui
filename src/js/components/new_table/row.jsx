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
  fixed?: boolean,
}

@updateOnlyForKeys([
  'children',
  'className',
  'sortData',
  'highlight',
  'fixed',
])
export default class Row extends Component {
  props: Props;

  state: {
    highlight: ?boolean,
    fixed: boolean,
  } = {
    highlight: this.props.highlight,
    fixed: false,
  };

  componentDidMount() {
    if (this.props.fixed && this.refs.row) {
      this._scrollStart = this.refs.row.getBoundingClientRect().top;

      window.addEventListener('resize', this.handleWindowResize);
      document.querySelector('.root__center>section').addEventListener(
        'scroll',
        this.handleScrolling
      );
    }
  }

  componentWillReceiveProps(nextProps: Object): void {
    this.startHighlight(nextProps.highlight);
  }

  componentWillUnmount() {
    clearTimeout(this._highlightTimeout);
    if (this.props.onHighlightEnd && this.props.highlight) this.props.onHighlightEnd();
  }

  _highlightTimeout = null;
  _resizeTimeout = null;
  _scrollStart: number = 0;

  handleWindowResize: Function = (): void => {
    clearTimeout(this._resizeTimeout);

    this._resizeTimeout = setTimeout(() => {
      if (this.state.fixed) {
        this.setState({ fixed: false });

        setTimeout(() => {
          this.setState({ fixed: true });
        }, 300);
      }
    }, 500);
  }

  handleScrolling: Function = (e: EventHandler) => {
    if (e.target.scrollTop > this._scrollStart - 80 && !this.state.fixed) {
      this.setState({
        fixed: true,
      });
    } else if (e.target.scrollTop <= this._scrollStart - 81 && this.state.fixed) {
      this.setState({
        fixed: false,
      });
    }
  };

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
      fixed: fixedProp,
    } = this.props;
    const { highlight, fixed } = this.state;

    const css = classNames({
      'row-highlight': highlight,
      'row-fixed': fixed,
      'row-hidden': fixedProp && !fixed,
    }, className);

    return (
      <tr
        ref="row"
        className={css}
        style={{
          top: fixed ? this._scrollStart - 10 : null,
        }}
      >
        { sortData && onSortChange ? (
          React.Children.map(children, (child: any, key) => (
            child ? React.cloneElement(child, { key, sortData, onSortChange, fixed }) : undefined
          ))
        ) : (
          children
        )}
      </tr>
    );
  }
}
