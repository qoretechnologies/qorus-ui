// @flow
import React from 'react';

import { Table, Thead, Tbody, Tr, Td, Th } from '../../../components/new_table';
import { hasPermission } from '../../../helpers/user';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../../components/controls';
import Text from '../../../components/text';
import ConfirmDialog from '../../../components/confirm_dialog';
import ExpandableItem from '../../../components/ExpandableItem';

type Props = {
  data: Object,
  title: string,
  perms: Array<Object>,
  onDelete: Function,
  onEdit: Function,
  openModal: Function,
  closeModal: Function,
};

const Property: Function = ({
  data,
  title,
  perms,
  onDelete,
  onEdit,
  openModal,
  closeModal,
}: Props): React.Element<any> => {
  const handlePropDeleteClick = (): void => {
    const confirmFunc = () => {
      onDelete({ domain: title });
      closeModal();
    };

    openModal(
      <ConfirmDialog onClose={closeModal} onConfirm={confirmFunc}>
        Are you sure you want to delete the property group{' '}
        <strong>{title}</strong>
      </ConfirmDialog>
    );
  };

  const handleKeyDeleteClick = (key: string): Function => (): void => {
    const confirmFunc = () => {
      onDelete({ domain: title, key });
      closeModal();
    };

    openModal(
      <ConfirmDialog onClose={closeModal} onConfirm={confirmFunc}>
        Are you sure you want to delete the property key <strong>{key}</strong>
      </ConfirmDialog>
    );
  };

  const handleEditClick = (
    key: string,
    value: string
  ): Function => (): void => {
    onEdit(null, { domain: title, key, value });
  };

  const handlePropAddClick = (): void => {
    onEdit(null, { domain: title });
  };

  return (
    <ExpandableItem title={title} show>
      {title !== 'omq' && (
        <div className="pull-right">
          <ButtonGroup>
            {hasPermission(perms, ['SERVER-CONTROL', 'SET-PROPERTY'], 'or') && (
              <Button
                text="Add property"
                iconName="add"
                onClick={handlePropAddClick}
                big
              />
            )}
            {hasPermission(
              perms,
              ['SERVER-CONTROL', 'DELETE-PROPERTY'],
              'or'
            ) && (
              <Button
                text="Remove group"
                iconName="cross"
                onClick={handlePropDeleteClick}
                btnStyle="danger"
                big
              />
            )}
          </ButtonGroup>
        </div>
      )}
      <Table condensed striped>
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
              <Td className="name large">{d}</Td>
              <Td className="text">
                <Text text={data[d]} renderTree />
              </Td>
              <Td className="narrow">
                {title !== 'omq' && (
                  <ButtonGroup>
                    {hasPermission(
                      perms,
                      ['SERVER-CONTROL', 'SET-PROPERTY'],
                      'or'
                    ) && (
                      <Button
                        iconName="edit"
                        onClick={handleEditClick(d, data[d])}
                      />
                    )}
                    {hasPermission(
                      perms,
                      ['SERVER-CONTROL', 'DELETE-PROPERTY'],
                      'or'
                    ) && (
                      <Button
                        iconName="cross"
                        onClick={handleKeyDeleteClick(d)}
                        btnStyle="danger"
                      />
                    )}
                  </ButtonGroup>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </ExpandableItem>
  );
};

export default Property;
