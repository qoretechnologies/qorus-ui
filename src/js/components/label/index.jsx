/* @flow */
import React, { PropTypes } from 'react';
import classNames from 'classnames';

const Label = (
  { style = '', children }: { style?: 'danger' | 'success' | 'warning', children?: string }
) => (
  <span
    className={classNames({
      label: true,
      [`label-${style}`]: !!style,
    })}
  >
    {children}
  </span>
);
Label.propTypes = {
  style: PropTypes.string,
  childrend: PropTypes.string,
};

export default Label;
