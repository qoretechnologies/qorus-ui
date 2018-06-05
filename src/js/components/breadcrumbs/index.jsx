// @flow
import React from 'react';

import Crumb from './crumb';

type Props = {
  children?: any,
};

const Breadcrumbs: Function = ({ children }: Props): React.Element<any> => (
  <ul className="pt-breadcrumbs">
    <li>
      <span className="pt-breadcrumbs-collapsed" />
    </li>
    {children}
  </ul>
);

export { Breadcrumbs, Crumb };
