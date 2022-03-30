// @flow
import React from 'react';
import { Link } from 'react-router';

type Props = {
  link?: string,
  disabled?: boolean,
  children?: any,
  text?: string,
  active?: boolean,
  icon?: string,
};

const Crumb: Function = ({
  link,
  disabled,
  text,
  children,
  active,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  <li>
    {link ? (
      <Link
        className={`bp3-breadcrumb ${disabled ? 'bp3-disabled' : ''} ${
          active ? 'bp3-breadcrumb-current' : ''
        }`}
        to={link}
      >
        {text || children}
      </Link>
    ) : (
      <span
        className={`bp3-breadcrumb ${disabled ? 'bp3-disabled' : ''} ${
          active ? 'bp3-breadcrumb-current' : ''
        }`}
      >
        {text || children}
      </span>
    )}
  </li>
);

export default Crumb;
