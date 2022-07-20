/* @flow */
import classNames from 'classnames';
import React from 'react';
import { Link } from 'react-router';

type Props = {
  url: string;
  name: string;
  icon?: string;
  active?: boolean;
};

const Item = ({
  url,
  name,
  icon,
  active = false,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
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
