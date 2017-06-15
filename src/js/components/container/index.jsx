// @flow
import React, { Component } from 'react';
import pure from 'recompose/onlyUpdateForKeys';

type Props = {
  children?: any,
  marginBottom?: number,
};

@pure(['children'])
export default class Container extends Component {
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
  }

  handleResize: Function = () => {
    if (this._el) {
      const { top } = this._el.getBoundingClientRect();
      const winHeight: number = window.innerHeight;
      const mb: number = this.props.marginBottom || 0;
      const height: number = winHeight - top - 60 - mb;

      this.setState({
        height,
      });
    }
  }

  render() {
    return (
      <div
        ref={this.handleRef}
        className="container-resizable"
        style={{
          height: this.state.height,
        }}
      >
        {this.props.children}
      </div>
    );
  }
}