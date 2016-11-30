/* @flow */
import React from 'react';
import { Row, Cell } from '../../../../components/table';
import Badge from '../../../../components/badge';
import { Controls, Control } from '../../../../components/controls';

type Props = {
  model: Object,
  canEdit: boolean,
  onEditClick: Function,
  canDelete: boolean,
  onDeleteClick: Function,
}

const UsersRow: Function = (
  { model, onEditClick, onDeleteClick, canEdit, canDelete }: Props
): React.Element<any> => {
  const handleEditClick: Function = (): void => {
    onEditClick(model);
  };

  const handleDeleteClick: Function = (): void => {
    onDeleteClick(model.username);
  };

  return (
    <Row>
      <Cell>
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
      </Cell>
      <Cell className="name">{ model.name }</Cell>
      <Cell className="name">{ model.username }</Cell>
      <Cell>
        { model.roles.map((role, index) => (
          <Badge
            key={index}
            val={role}
            label="info"
          />
        ))}
      </Cell>
    </Row>
  );
};

export default UsersRow;
