/* @flow */
import React from 'react';
import { Link } from 'react-router';

const ExtensionList = ({ extensions }: { extensions: Array<Object>}) => (
  <ul>
    {extensions.map(item => (
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'url' does not exist on type 'Object'.
      <li key={item.url}>
        { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'. */ }
        <Link to={`/extension/${item.name}`}>{item.menuname}</Link>
        <br />
        { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'desc' does not exist on type 'Object'. */ }
        <small>{item.desc}</small>
      </li>
    ))}
  </ul>
);

export default ExtensionList;
