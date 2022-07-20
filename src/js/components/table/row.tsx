/* @flow */
import classNames from 'classnames';
import omit from 'lodash/omit';
import React, { Component } from 'react';

export default class Row extends Component {
  props: {
    cells?: Function;
    data?: any;
    children?: any;
    highlight?: false;
    onHighlightEnd?: Function;
  } = this.props;

  state: {
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    highlight: boolean;
  } = {
    highlight: this.props.highlight,
  };

  componentWillMount() {
    this.startHighlight(this.props.highlight);
  }

  componentWillReceiveProps(nextProps: any): void {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'highlight' does not exist on type 'Objec... Remove this comment to see the full error message
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
    const { cells, data, children, ...restProps } = this.props;
    const className = classNames(
      { 'row-highlight': this.state.highlight },
      // @ts-ignore ts-migrate(2339) FIXME: Property 'className' does not exist on type '{ hig... Remove this comment to see the full error message
      restProps.className
    );
    const updatedProps = omit(restProps, ['highlight', 'onHighlightEnd']);
    const newProps = { ...updatedProps, ...{ className } };

    return React.createElement(
      'tr',
      newProps,
      ...(cells ? cells(data) : React.Children.toArray(children))
    );
  }
}
