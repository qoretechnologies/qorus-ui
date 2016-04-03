import React, { PropTypes } from 'react';
import { preventDefault } from '../../utils';

/**
 * @param {!{ title: ?(string|number) }} props
 * @return {!ReactElement}
 */
export default function Item(props) {
  return (
    <li>
      <a
        onClick={preventDefault(props.action)}
        href="#"
      >{props.title}</a>
    </li>
  );
}

Item.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};
