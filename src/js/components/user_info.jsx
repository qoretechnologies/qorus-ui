import React, { PropTypes } from 'react';


/**
 * Button to be placed on Bootstrap navbar which displays username.
 *
 * @param {!{ user: !{ name: string } }} props
 * @return {ReactElement}
 */
export default function UserInfo(props) {
  return (
    <button
      type="button"
      className="btn btn-inverse navbar-btn navbar-right"
    >
      <i className="fa fa-user" />
      {' '}
      <span>{props.user.name}</span>
    </button>
  );
}

UserInfo.propTypes = {
  user: PropTypes.object.isRequired,
};
