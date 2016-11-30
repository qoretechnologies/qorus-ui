/* @flow */
import React, { Component, PropTypes } from 'react';
import Actions from './actions';

class Toolbar extends Component {
  static propTypes = {
    children: PropTypes.any,
    sticky: PropTypes.bool,
  };

  state: {
    sticky: boolean,
  } = {
    sticky: false,
  };

  componentDidMount() {
    if (this.props.sticky) {
      this._start = this.refs.toolbar.getBoundingClientRect().top;

      document.querySelector('.root__center>section').addEventListener(
        'scroll',
        this.handleScrolling
      );
    }
  }

  componentWillUnmount() {
    document.querySelector('.root__center>section').removeEventListener(
      'scroll',
      this.handleScrolling)
    ;
  }

  _start: number = 0;

  handleScrolling: Function = (e: EventHandler) => {
    if (e.target.scrollTop > this._start - 50 && !this.state.sticky) {
      this.setState({
        sticky: true,
      });
    } else if (e.target.scrollTop <= this._start - 51 && this.state.sticky) {
      this.setState({
        sticky: false,
      });
    }
  };

  render() {
    return (
      <div
        ref="toolbar"
        id="workflows-toolbar"
        className={`toolbar ${this.state.sticky ? 'sticky' : ''}`}
        role="toolbar"
      >
        <div className="workflows-toolbar">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export { Actions };
export default Toolbar;
