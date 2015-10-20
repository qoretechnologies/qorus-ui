import React, { Component } from 'react';
import clNs from 'classnames';
import pureRender from './utils';

@pureRender
class Messenger extends Component {
  render() {
    const cls = clNs(['messenger', 'messenger-fixed', 'messenger-on-bottom',
                      'messenger-on-right', 'messenger-theme-block']);

    return (
      <ul id='msg' className={ cls } />
    );
  }
}

export default Messenger;
