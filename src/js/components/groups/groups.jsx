/* @flow */
import React, { PropTypes } from 'react';


/**
 * Wrapper for Group elements.
 *
 * @param {!{ children: Array<!ReactElement> }} props
 * @return {!ReactElement}
 */
export default function Groups(props: { children: any }): React.Element<any> {
  return (
    <div className="groups">
      <h4>Groups</h4>
      {props.children}
    </div>
  );
}

Groups.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
};
