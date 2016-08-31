/* @flow */
import React from 'react';
import { Link } from 'react-router';

const ExtensionList = ({ extensions }: { extensions: Array<Object>}) => (
  <ul>
    {extensions.map(item => (
      <li key={item.url}>
        <Link to={`/extension/${item.name}`}>{item.menuname}</Link>
        <br />
        <small>{item.desc}</small>
      </li>
    ))}
  </ul>
);

export default ExtensionList;
