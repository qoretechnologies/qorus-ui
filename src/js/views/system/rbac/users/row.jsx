/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';

import { Tr, Td } from '../../../../components/new_table';
import Badge from '../../../../components/badge';
import { Controls, Control } from '../../../../components/controls';
import Text from '../../../../components/text';

type Props = {
  model: Object,
  canEdit: boolean,
  onEditClick: Function,
  handleEditClick: Function,
  canDelete: boolean,
  onDeleteClick: Function,
  handleDeleteClick: Function,
}

const UsersRow: Function = ({
  model,
  handleEditClick,
  handleDeleteClick,
  canEdit,
  canDelete,
}: Props): React.Element<any> => (
  <Tr>
    <Td className="narrow">
      <Controls grouped>
        { canEdit && (
          <Control
            icon="edit"
            btnStyle="warning"
            action={handleEditClick}
            title="Edit user"
          />
        )}
        { canDelete && (
          <Control
            icon="close"
            btnStyle="danger"
            action={handleDeleteClick}
            title="Remove user"
          />
        )}
      </Controls>
    </Td>
    <Td className="name">{model.name}</Td>
    <Td className="text big">
      <Text text={model.username} />
    </Td>
    <Td className="text">
      { model.roles.map((role, index) => (
        <Badge
          key={index}
          val={role}
          label="info"
        />
      ))}
    </Td>
  </Tr>
);

export default compose(
  withHandlers({
    handleEditClick: ({ model, onEditClick }: Props): Function => (): void => {
      onEditClick(model);
    },
    handleDeleteClick: ({ model, onDeleteClick }: Props): Function => (): void => {
      onDeleteClick(model.username);
    },
  }),
  pure(['model'])
)(UsersRow);
