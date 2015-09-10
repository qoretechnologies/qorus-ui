import React, { Component, PropTypes } from 'react';
import pureRender from 'pure-render-decorator';

const bugUrl = 'http://bugs.qoretechnologies.com/projects/' +
               'webapp-interface/issues/new';

@pureRender
class Footer extends Component {
  static propTypes = {
    info: PropTypes.object
  }

  render() {
    const { info } = this.props;

    return (
      <footer id='footer' className='footer'>
        <div className='container-fluid'>
          <p className='credit muted pull-right'>Qorus Integration Engine
            <small>(Schema: <span id='schema'>Unknown</span>)</small>
            <small>(Version: <span id='build'>{ info.version }</span>)</small>
            &copy; <a href='http://qoretechnologies.com'>Qore Technologies</a> |
            <a href={ bugUrl }>Report Bug</a></p>
        </div>
      </footer>
    );
  }
}

export default Footer;
