/* @flow */
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import { Link } from 'react-router';

const HealthItem = ({
  title,
  children,
  link,
}: {
  title: string,
  children?: any,
  link?: boolean
}) => (
  <tr>
    <th>
      { link ? (
        <Link to={`/system/alerts/${title.toLowerCase()}`}>{title}</Link>
      ) : title}
    </th>
    <td>{children}</td>
  </tr>
);

export default pure(['title', 'children', 'link'])(HealthItem);
