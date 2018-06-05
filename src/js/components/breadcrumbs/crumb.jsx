// @flow
import React from 'react';

type Props = {
  link?: string,
  disabled?: boolean,
  children?: any,
  text?: string,
  active?: boolean,
};

const Crumb: Function = ({
  link,
  disabled,
  text,
  children,
  active,
}: Props): React.Element<any> => (
  <li>
    {link ? (
      <a
        className={`pt-breadcrumb ${disabled ? 'pt-disabled' : ''} ${
          active ? 'pt-breadcrumb-current' : ''
        }`}
        href={link}
      >
        {text || children}
      </a>
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
