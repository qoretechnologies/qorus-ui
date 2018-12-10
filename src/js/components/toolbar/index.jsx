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

  render() {
    const { className, marginBottom, mb, mt, children } = this.props;
    return (
      <div
        className={`${className} ${(marginBottom || mb) &&
          'margin-bottom'} ${mt && 'margin-top'} toolbar`}
        role="toolbar"
        style={{
          flex: '0 1 auto',
        }}
      >
        {children}
      </div>
    );
  }
}

export { Actions };
export default Toolbar;
