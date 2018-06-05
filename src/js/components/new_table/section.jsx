/* @flow */
import React, { Component } from 'react';
import mapProps from 'recompose/mapProps';
import updateOnlyForKeys from 'recompose/onlyUpdateForKeys';
import setDisplayName from 'recompose/setDisplayName';
import compose from 'recompose/compose';
import classNames from 'classnames';

type Props = {
  type: string,
  children: any,
  className?: string,
  hover?: boolean,
  striped?: boolean,
  bordered?: boolean,
  height?: number | string,
  fixed?: boolean,
  Tag: string,
  marginBottom: number,
  hasFooter: boolean,
};

class Section extends Component {
  props: Props;

  state: {
    height: string | number,
    initHeight: number,
  } = {
    height: this.props.height || 'auto',
    initHeight: 0,
  };

  componentDidMount() {
    window.addEventListener('resize', this.adjustHeight);
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (this.props.marginBottom !== nextProps.marginBottom) {
      this.adjustHeight(null, nextProps.marginBottom);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.adjustHeight);
  }

  _el: ?Object = null;

  handleRef: Function = (element: Object): void => {
    if (!this.props.height && element) {
      this._el = element;
      const { height } = this._el.getBoundingClientRect();

      this.setState({
        initHeight: height,
      });

      this.adjustHeight(height);
    }
  };

  adjustHeight: Function = (
    initHeight: ?number,
    marginBottom: ?number
  ): void => {
    if (this._el) {
      const { top } = this._el.getBoundingClientRect();
      const winHeight = window.innerHeight;
      const mb: number =
        marginBottom || marginBottom === 0
          ? marginBottom
          : this.props.marginBottom;
      const footer: number = this.props.hasFooter ? 22 : 0;
      const height: number = winHeight - top - 60 - mb - footer;
      const h =
        typeof initHeight === 'number' ? initHeight : this.state.initHeight;

      if (h > height) {
        this.setState({
          height,
        });
      }
    }
  };

  render() {
    const {
      type,
      hover,
      striped,
      children,
      className,
      fixed,
      Tag,
      bordered,
    } = this.props;
    const { height } = this.state;

    if (!fixed) {
      return <Tag>{children}</Tag>;
    }

    if (type === 'header') {
      return <div className="table-header-wrapper">{children}</div>;
    }

    if (type === 'body') {
      return (
        <div
          ref={this.handleRef}
          className="table-body-wrapper"
          style={{
            height,
          }}
        >
          <table
            className={classNames(
              'table table-condensed table--data table-body',
              {
                'table-hover': hover,
                'table-striped': striped,
                'table-bordered': bordered,
                'fixed-table': true,
              },
              className
            )}
          >
            <tbody
              style={{
                height,
              }}
            >
              {children}
            </tbody>
          </table>
        </div>
      );
    }

    return <div className="table-footer-wrapper">{children}</div>;
  }
}

Section = updateOnlyForKeys(['children', 'height'])(Section);

const Thead = compose(
  setDisplayName('Thead'),
  mapProps((props: Object) => ({ ...props, type: 'header', Tag: 'thead' }))
)(Section);

const Tbody = compose(
  setDisplayName('Tbody'),
  mapProps((props: Object) => ({ ...props, type: 'body', Tag: 'tbody' }))
)(Section);

const Tfooter = compose(
  setDisplayName('Tfoot'),
  mapProps((props: Object) => ({ ...props, type: 'footer', Tag: 'tfoot' }))
)(Section);

export { Thead, Tbody, Tfooter };
