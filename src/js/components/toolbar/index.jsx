/* @flow */
import React, { Component, PropTypes } from 'react';
import Actions from './actions';

class Toolbar extends Component {
  static propTypes = {
    children: PropTypes.any,
    sticky: PropTypes.bool,
    className: PropTypes.string,
    marginBottom: PropTypes.bool,
    mb: PropTypes.bool,
    mt: PropTypes.bool,
  };

  state: {
    sticky: boolean,
  } = {
    sticky: false,
  };

  componentDidMount() {
    if (this.props.sticky) {
      this._start = this.refs.toolbar.getBoundingClientRect().top;

      document
        .querySelector('.root__center>section')
        .addEventListener('scroll', this.handleScrolling);
    }
  }

  componentWillUnmount() {
    document
      .querySelector('.root__center>section')
      .removeEventListener('scroll', this.handleScrolling);
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
    const { className, marginBottom, mb, mt, sticky, children } = this.props;
    return (
      <div
        ref="toolbar"
        id="workflows-toolbar"
        className={`${className} ${(marginBottom || mb) &&
          'margin-bottom'} ${mt && 'margin-top'} toolbar ${
          sticky ? 'sticky' : ''
        }`}
        role="toolbar"
      >
        {children}
      </div>
    );
  }
}

export { Actions };
export default Toolbar;
