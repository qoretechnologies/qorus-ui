import React, { Component, PropTypes } from 'react';


class Toolbar extends Component {
  static propTypes = {
    children: PropTypes.node
  };

  render() {
    return (
      <div id='workflows-toolbar' className='toolbar'>
        <div className='workflows-toolbar btn-toolbar sticky toolbar'>
          { this.props.children }
        </div>
      </div>
    );
  }
}

export default Toolbar;
