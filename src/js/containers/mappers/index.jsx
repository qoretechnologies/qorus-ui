/* @flow */
import React from 'react';
import { Link } from 'react-router';

import checkNoData from '../../hocomponents/check-no-data';

const MappersTable = ({ mappers }: { mappers: Array<Object> }) => (
  <table className="table table-stripped">
    <thead>
      <tr>
        <th>ID</th>
        <th>Mapper</th>
        <th>Version</th>
        <th>Type</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {mappers.map(item => (
        <tr key={`mapper_${item.mapperid}`}>
          <td>{item.mapperid}</td>
          <td>{item.name}</td>
          <td>{item.version}</td>
          <td>{item.type}</td>
          <td><Link to={`/mappers/${item.mapperid}`}> Detail </Link></td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default checkNoData(
  ({ mappers }: { mappers?: Array<Object> }) => (mappers && mappers.length > 0)
)(
  MappersTable
);
