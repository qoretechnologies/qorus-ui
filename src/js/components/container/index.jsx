// @flow
import React, { Component } from 'react';
import pure from 'recompose/onlyUpdateForKeys';

type Props = {
  children?: any,
  marginBottom?: number,
  className?: string,
  width?: number,
  fill?: boolean,
  noOverflow?: boolean,
};

@pure(['children'])
class Container extends Component {
  props: Props;

  state: {
    height?: number,
  } = {
    height: 0,
  };

  componentDidMount(): void {
    if (this._el) {
      this.handleResize();

      window.addEventListener('resize', this.handleResize);
    }
  }

  componentWillUnmount(): void {
    window.removeEventListener('resize', this.handleResize);
  }

  _el: ?Object = null;

  handleRef: Function = (el: Object) => {
    if (el) {
      this._el = el;
    }
  };

  handleResize: Function = () => {
    if (this._el) {
      const { top } = this._el.getBoundingClientRect();
      const winHeight: number = window.innerHeight;
      const mb: number = this.props.marginBottom || 0;
      const height: number = winHeight - top - 47 - mb;

      this.setState({
        height,
      });
    }
  };

  render() {
    const { className, children, width, fill, noOverflow } = this.props;
    const { height } = this.state;

    return (
      <div
        ref={this.handleRef}
        className={`container-resizable ${className || ''}`}
        style={{
          [fill ? 'height' : 'maxHeight']: height,
          width: width || '100%',
          overflowY: noOverflow ? 'hidden' : 'auto',
        }}
      >
        {children}
      </div>
    );
  }
}

export default Container;
