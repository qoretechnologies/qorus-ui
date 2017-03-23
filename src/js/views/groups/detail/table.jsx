import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { Link } from 'react-router';

import { Table, Thead, Tbody, Tr, Th, Td } from '../../../components/new_table';

type Props = {
  data: Array<Object>,
  columns: Array<string>,
  type: string,
};

const GroupDetailTable: Function = ({ data, columns, type }: Props): React.Element<any> => {
  const renderColumns: Function = (item: Object) => (
    columns.map((column: string, index: number) => {
      const name = item[column.toLowerCase()];
      let val = item[column.toLowerCase()];
      let css;

      if (column === 'Name') {
        css = 'name';

        switch (type) {
          case 'Services':
            val = <Link to="/services"> { name } </Link>;
            break;
          case 'Workflows':
            val = <Link to={`/workflow/${item.workflowid}`}> { name } </Link>;
            break;
          case 'Jobs':
            val = <Link to={`/jobs/${item.jobid}`}> { name } </Link>;
            break;
          case 'Roles':
            val = item;
            break;
          default:
            break;
        }
      }

      return (
        <Td key={index} className={css}>
          { val }
        </Td>
      );
    })
  );

  return (
    <div className="col-xs-4">
      <h4> { type } </h4>
      <Table condensed striped>
        <Thead>
          <Tr>
            {columns.map((column, index) => (
              <Th key={index}>
                { column }
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item: Object, index: number): React.Element<Tr> => (
            <Tr key={index}>
              { renderColumns(item) }
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
};

export default compose(
  pure(['data'])
)(GroupDetailTable);
