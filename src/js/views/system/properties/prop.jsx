// @flow
import React from 'react';

import { Table, Tbody, Tr, Td, Th } from '../../../components/new_table';
import PermButton from './perm_control';
import { Controls } from '../../../components/controls';
import Text from '../../../components/text';

type Props = {
  data: Object,
  title: string,
  perms: Array<Object>,
  onDelete: Function,
  onEdit: Function,
}

const Property: Function = ({
  data,
  title,
  perms,
  onDelete,
  onEdit,
}: Props): React.Element<any> => {
  const handlePropDeleteClick = (): void => {
    onDelete({ domain: title });
  };

  const handleKeyDeleteClick = (key: string): Function => (): void => {
    onDelete({ domain: title, key });
  };

  const handleEditClick = (key: string, value: string): Function => (): void => (
    onEdit(null, { domain: title, key, value })
  );

  return (
    <div className="container-fluid">
      <h4>
        { title }
        { title !== 'omq' && (
          <div className="pull-right">
            <Controls grouped>
              <PermButton
                perms={perms}
                reqPerms={['SERVER-CONTROL', 'DELETE-PROPERTY']}
                icon="times"
                btnStyle="danger"
                onClick={handlePropDeleteClick}
                title="Remove permission group"
              />
            </Controls>
          </div>
        )}
      </h4>
      <Table
        condensed
        striped
        className="props-table"
      >
        <Tbody>
          {Object.keys(data).map((d, key) => (
            <Tr key={key}>
              <Th className="name">{ d }</Th>
              <Td className="text">
                <Text text={data[d]} renderTree />
              </Td>
              <Td>
                {title !== 'omq' && (
                  <Controls grouped>
                    <PermButton
                      perms={perms}
                      reqPerms={['SERVER-CONTROL', 'SET-PROPERTY']}
                      icon="pencil"
                      btnStyle="warning"
                      onClick={handleEditClick(d, data[d])}
                      title="Edit permission"
                    />
                    <PermButton
                      perms={perms}
                      reqPerms={['SERVER-CONTROL', 'DELETE-PROPERTY']}
                      icon="times"
                      btnStyle="danger"
                      onClick={handleKeyDeleteClick(d)}
                      title="Remove permission"
                    />
                  </Controls>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
};

export default Property;
