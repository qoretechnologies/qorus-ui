import React, { PropTypes } from 'react';

/**
 * @param {!{ title: ?(string|number) }} props
 * @return {!ReactElement}
 */
export default function Item(props) {
  return (
    <li>
      <a href="#">{props.title}</a>
    </li>
  );
}

Item.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};
