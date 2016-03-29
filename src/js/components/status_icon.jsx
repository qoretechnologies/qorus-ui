import React, { PropTypes } from 'react';
import classNames from 'classnames';


/**
 * Status icon component dependent on value prop.
 *
 * @param {!{ value: * }} props
 * @return {!ReactElement}
 */
export default function StatusIcon(props) {
  return (
    <i
      className={classNames({
        fa: true,
        'fa-check-circle': props.value,
        'fa-minus-circle': !props.value,
        'text-success': props.value,
        'text-danger': !props.value,
      })}
    />
  );
}

StatusIcon.propTypes = {
  value: PropTypes.any,
};
