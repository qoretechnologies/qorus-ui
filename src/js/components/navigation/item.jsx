/* @flow */
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

type Props = {
  url: string,
  name: string,
  icon?: string,
  active?: boolean,
}

const Item = ({ url, name, icon, active }: Props): React.Element<any> => (
  <li
    role="presentation"
    className={classNames({
      active,
    })}
  >
    <Link to={url}>
      <i
        className={classNames(
          'side-menu__icon',
          'fa',
          'fa-2x',
          icon
        )}
      />
      <span className="side-menu__text">{ name }</span>
    </Link>
  </li>
);

Item.propTypes = {
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  icon: PropTypes.string,
  active: PropTypes.bool,
};

Item.defaultProps = {
  active: false,
};

export default Item;

