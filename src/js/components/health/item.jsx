/* @flow */
import React from 'react';
import { Link } from 'react-router';

const HealthItem = ({ title, children, link }: { title: string, children?: any}) => (
  <tr>
    <th>
      { link ? (
        <Link to={`/system/alerts/${title.toLowerCase()}`}>{title}</Link>
      ) : title}
    </th>
    <td>{children}</td>
  </tr>
);

export default HealthItem;
