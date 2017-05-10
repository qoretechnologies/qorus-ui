// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';

import { Table, Thead, Tbody, Tr, Td, Th } from '../../../components/new_table';
import PermButton from './perm_control';
import { Controls } from '../../../components/controls';
import Text from '../../../components/text';
import Icon from '../../../components/icon';

type Props = {
  data: Object,
  title: string,
  perms: Array<Object>,
  onDelete: Function,
  onEdit: Function,
  expanded: boolean,
  setExpanded: Function,
  handleExpandClick: Function,
}

const Property: Function = ({
  data,
  title,
  perms,
  onDelete,
  onEdit,
  expanded,
  handleExpandClick,
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
    <div>
      <div className="row">
        <div className="col-lg-12">
          <div className="pull-left">
            <h4 onClick={handleExpandClick} className="cpointer">
              <Icon icon={expanded ? 'minus-square-o' : 'plus-square-o'} />
              {' '}
              { title }
            </h4>
          </div>
          { title !== 'omq' && (
            <div className="pull-right">
              <PermButton
                label="Remove group"
                perms={perms}
                reqPerms={['SERVER-CONTROL', 'DELETE-PROPERTY']}
                icon="times"
                btnStyle="danger"
                onClick={handlePropDeleteClick}
                title="Remove permission group"
              />
            </div>
          )}
        </div>
      </div>
      {expanded && (
        <Table
          condensed
          striped
        >
          <Thead>
            <Tr>
              <Th className="name large">Name</Th>
              <Th className="text">Prop</Th>
              <Th className="narrow">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.keys(data).map((d, key) => (
              <Tr key={key}>
                <Td className="name large">{ d }</Td>
                <Td className="text">
                  <Text text={data[d]} renderTree />
                </Td>
                <Td className="narrow">
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
      )}
    </div>
  );
};

export default compose(
  withState('expanded', 'setExpanded', true),
  withHandlers({
    handleExpandClick: ({ expanded, setExpanded }: Props): Function => (): void => {
      setExpanded(() => !expanded);
    },
  }),
  pure([
    'expanded',
    'data',
    'perms',
  ])
)(Property);
