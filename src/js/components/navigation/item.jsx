/* @flow */
import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

type Props = {
  url: string,
  name: string,
  icon?: string,
  active?: boolean,
};

const Item = ({
  url,
  name,
  icon,
  active: active = false,
}: Props): React.Element<any> => (
  <li
    role="presentation"
    className={classNames({
      active,
    })}
  >
    <Link to={url}>
      <i className={classNames('side-menu__icon', 'fa', 'fa-2x', icon)} />
      <span className="side-menu__text">{name}</span>
    </Link>
  </li>
);

export default Item;
