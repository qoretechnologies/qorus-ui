// @flow
import React from 'react';
import { Link } from 'react-router';

type Props = {
  link?: string,
  disabled?: boolean,
  children?: any,
  text?: string,
  active?: boolean,
  iconName?: string,
};

const Crumb: Function = ({
  link,
  disabled,
  text,
  children,
  active,
  iconName,
}: Props): React.Element<any> => (
  <li>
    {link ? (
      <Link
        className={`pt-breadcrumb ${disabled ? 'pt-disabled' : ''} ${
          active ? 'pt-breadcrumb-current' : ''
        }`}
        to={link}
      >
        {text || children}
      </Link>
    ) : (
      <span
        className={`pt-breadcrumb ${disabled ? 'pt-disabled' : ''} ${
          active ? 'pt-breadcrumb-current' : ''
        }`}
      >
        {text || children}
      </span>
    )}
  </li>
);

export default Crumb;
