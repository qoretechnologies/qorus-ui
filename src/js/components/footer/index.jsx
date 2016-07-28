/* @flow */
import React, { PropTypes } from 'react';


/**
 * Display info about Qorus instance and useful links.
 *
 * @param {!{ info: !Object }} props
 * @return {!ReactElement}
 */
export default function Footer(props: { info: Object }) {
  return (
    <footer>
      <div className="container-fluid">
        <p className="text-right text-muted">
          {'Qorus Integration Engine '}
          {props.info && props.info['omq-schema'] && (
            <small>{`(Schema: ${props.info['omq-schema']})`}</small>
          )}
          {props.info && props.info['omq-schema'] && ' '}
          {props.info && props.info['omq-version'] && (
            <small>
              {'(Version: '}
              {props.info['omq-version']}
              {props.info['omq-build'] && `.${props.info['omq-build']}`}
              {')'}
            </small>
          )}
          {props.info && props.info['omq-version'] && ' '}
          &copy;
          {' '}
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

Footer.propTypes = {
  info: PropTypes.object,
};
