/* @flow */
import React from 'react';
import { Row, Cell } from '../../../../components/table';
import { Controls, Control } from '../../../../components/controls';

type Props = {
  model: Object,
  onEditClick: Function,
  onDeleteClick: Function,
  canEdit: boolean,
  canDelete: boolean,
}

const PermsRow: Function = (
  { model, onEditClick, onDeleteClick, canEdit, canDelete }: Props
): React.Element<any> => {
  const handleEditClick: Function = (): void => {
    onEditClick(model);
  };

  const handleDeleteClick: Function = (): void => {
    onDeleteClick(model.name);
  };

  return (
    <Row>
      <Cell>
        <Controls grouped>
          { canEdit && model.permission_type !== 'SYSTEM' && (
            <Control
              icon="edit"
              btnStyle="warning"
              action={handleEditClick}
            />
          )}
          { canDelete && model.permission_type !== 'SYSTEM' && (
            <Control
              icon="close"
              btnStyle="danger"
              action={handleDeleteClick}
            />
          )}
        </Controls>
      </Cell>
      <Cell>{ model.permission_type }</Cell>
      <Cell className="name">{ model.name }</Cell>
      <Cell>{ model.desc }</Cell>
    </Row>
  );
};

export default PermsRow;
