/* @flow */
import React, { PropTypes } from 'react';

/**
 * Wrapper for modal footer content (usually action buttons).
 *
 * @param {!{ children: ReactNode }} props
 * @return {!ReactElement}
 */
export default function Footer(props: { children: any }) {
  return (
    <div className="pt-dialog-footer">
      <div className="pt-dialog-footer-actions">{props.children}</div>
    </div>
  );
}

Footer.propTypes = {
  children: PropTypes.node,
};
