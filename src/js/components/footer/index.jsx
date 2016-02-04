import React, { Component, PropTypes } from 'react';


import { pureRender } from '../utils';


/**
 * Display info about Qorus instance and useful links.
 */
@pureRender
export default class Footer extends Component {
  static propTypes = {
    info: PropTypes.object,
  };


  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    return (
      <footer>
        <div className="container-fluid">
          <p className="text-right text-muted">
            {'Qorus Integration Engine '}
            {this.props.info && this.props.info['omq-schema'] && (
              <small>{`(Schema: ${this.props.info['omq-schema']})`}</small>
            )}
            {this.props.info && this.props.info['omq-schema'] && ' '}
            {this.props.info && this.props.info['omq-version'] && (
              <small>
                {'(Version: '}
                {this.props.info['omq-version']}
                {this.props.info['omq-build'] &&
                 `.${this.props.info['omq-build']}`}
                {')'}
              </small>
            )}
            {this.props.info && this.props.info['omq-version'] && ' '}
            &copy;&nbsp;
            <a href="http://qoretechnologies.com">Qore Technologies</a>
            {' | '}
            <a
              href={'http://bugs.qoretechnologies.com/' +
                    'projects/webapp-interface/issues/new'}
            >
              Report Bug
            </a>
          </p>
        </div>
      </footer>
    );
  }
}
