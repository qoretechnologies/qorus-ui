// @flow
import React from 'react';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';

import { Table, Thead, Tbody, Tr, Td, Th } from '../../../components/new_table';
import PermButton from './perm_control';
import { Controls } from '../../../components/controls';
import Text from '../../../components/text';
import Icon from '../../../components/icon';
import ConfirmDialog from '../../../components/confirm_dialog';

type Props = {
  data: Object,
  title: string,
  perms: Array<Object>,
  onDelete: Function,
  onEdit: Function,
  expanded: boolean,
  setExpanded: Function,
  handleExpandClick: Function,
  openModal: Function,
  closeModal: Function,
}

const Property: Function = ({
  data,
  title,
  perms,
  onDelete,
  onEdit,
  expanded,
  handleExpandClick,
  openModal,
  closeModal,
}: Props): React.Element<any> => {
  const handlePropDeleteClick = (): void => {
    const confirmFunc = () => {
      onDelete({ domain: title });
      closeModal();
    };

    openModal(
      <ConfirmDialog
        onClose={closeModal}
        onConfirm={confirmFunc}
      >
        Are you sure you want to delete the property group <strong>{title}</strong>
      </ConfirmDialog>
    );
  };

  const handleKeyDeleteClick = (key: string): Function => (): void => {
    const confirmFunc = () => {
      onDelete({ domain: title, key });
      closeModal();
    };

    openModal(
      <ConfirmDialog
        onClose={closeModal}
        onConfirm={confirmFunc}
      >
        Are you sure you want to delete the property key <strong>{key}</strong>
      </ConfirmDialog>
    );
  };

  const handleEditClick = (key: string, value: string): Function => (): void => {
    onEdit(null, { domain: title, key, value });
  };

  const handlePropAddClick = (): void => {
    onEdit(null, { domain: title });
  };

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
              <Controls grouped noControls>
                <PermButton
                  label="Add property"
                  perms={perms}
                  reqPerms={['SERVER-CONTROL', 'SET-PROPERTY']}
                  icon="plus"
                  btnStyle="success"
                  onClick={handlePropAddClick}
                  title="Add permission to this group"
                />
                <PermButton
                  label="Remove group"
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
)(Property);
