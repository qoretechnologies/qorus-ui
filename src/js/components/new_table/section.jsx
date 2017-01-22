/* @flow */
import React, { Component } from 'react';
import mapProps from 'recompose/mapProps';
import updateOnlyForKeys from 'recompose/onlyUpdateForKeys';
import classNames from 'classnames';

type Props = {
  type: string,
  children: any,
  className: string,
  hover: boolean,
  striped: boolean,
  condensed: boolean,
  height: number | string,
  fixed: boolean,
  Tag: string,
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
  }

  adjustHeight: Function = (initHeight: ?number): void => {
    if (this._el) {
      const { top } = this._el.getBoundingClientRect();
      const winHeight = window.innerHeight;
      const height = winHeight - top - 50;
      const h = typeof initHeight === 'number' ? initHeight : this.state.initHeight;

      if (h > height) {
        this.setState({
          height,
        });
      }
    }
  }

  render() {
    const { type, hover, striped, children, className, fixed, Tag } = this.props;
    const { height } = this.state;

    if (!fixed) {
      return (
        <Tag>
          { children }
        </Tag>
      );
    }

    if (type === 'header') {
      return (
        <div className="table-header-wrapper">
          <table
            className="table table-condensed table--data table-header"
          >
            <thead>
              { children }
            </thead>
          </table>
        </div>
      );
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
            className={
              classNames(
                'table table-condensed table--data table-body',
                {
                  'table-hover': hover,
                  'table-striped': striped,
                },
                className
              )
            }
          >
            <tbody
              style={{
                height,
              }}
            >
              { children }
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div className="table-header-wrapper">
        <table
          className="table table-condensed table--data table-header"
        >
          <tfoot>
            { children }
          </tfoot>
        </table>
      </div>
    );
  }
}

Section = updateOnlyForKeys([
  'children',
  'height',
])(Section);

const Thead = mapProps((props: Object) => ({ ...props, type: 'header', Tag: 'thead' }))(Section);
const Tbody = mapProps((props: Object) => ({ ...props, type: 'body', Tag: 'tbody' }))(Section);
const Tfooter = mapProps((props: Object) => ({ ...props, type: 'footer', Tag: 'tfoot' }))(Section);

export {
  Thead,
  Tbody,
  Tfooter,
};
