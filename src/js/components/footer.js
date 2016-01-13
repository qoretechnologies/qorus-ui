import React, { Component, PropTypes } from 'react';
import { pureRender } from './utils';

const bugUrl = 'http://bugs.qoretechnologies.com/projects/' +
               'webapp-interface/issues/new';

@pureRender
class Footer extends Component {
  static propTypes = {
    info: PropTypes.object
  };

  render() {
    const { info } = this.props;

    const schema = info['omq-schema'];
    const version = `${info['omq-version']}.${info['omq-build']}`;

    return (
      <footer id='footer' className='footer'>
        <div className='container-fluid'>
          <p className='credit muted pull-right'>Qorus Integration Engine&nbsp;
            <small>(Schema: { schema })</small>&nbsp;
            <small>(Version: { version })</small>&nbsp;
            &copy; <a href='http://qoretechnologies.com'>Qore Technologies</a> |
            &nbsp;<a href={ bugUrl }>Report Bug</a></p>
        </div>
      </footer>
    );
  }
}

export default Footer;
