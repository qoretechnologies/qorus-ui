/* @flow */
import React, { PropTypes } from 'react';

/**
 * Wrapper for modal main content.
 *
 * @param {!{ children: ReactNode }} props
 * @return {!ReactElement}
 */
export default function Body(props: { children: any }) {
  return <div className="bp3-dialog-body">{props.children}</div>;
}

Body.propTypes = {
  children: PropTypes.node,
};
