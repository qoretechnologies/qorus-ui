/* @flow */
import React from 'react';
import { Row, Cell } from '../../../../components/table';
import { Controls, Control } from '../../../../components/controls';

type Props = {
  model: Object,
  onEditClick: Function,
  onDeleteClick: Function,
  onCloneClick: Function,
  canEdit: boolean,
  canDelete: boolean,
  canCreate: boolean,
}

const RolesRow: Function = (
  { model, onEditClick, onDeleteClick, onCloneClick, canEdit, canDelete, canCreate }: Props
): React.Element<any> => {
  const handleEditClick: Function = (): void => {
    onEditClick(model);
  };

  const handleDeleteClick: Function = (): void => {
    onDeleteClick(model.role);
  };

  const handleCloneClick: Function = (): void => {
    onCloneClick(model);
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
            />
          )}
          { canDelete && (
            <Control
              icon="close"
              btnStyle="danger"
              action={handleDeleteClick}
            />
          )}
          { canCreate && (
            <Control
              icon="copy"
              btnStyle="success"
              action={handleCloneClick}
            />
          )}
        </Controls>
      </Cell>
      <Cell className="name">{ model.role }</Cell>
      <Cell>{ model.provider }</Cell>
      <Cell>{ model.desc }</Cell>
    </Row>
  );
}
;

export default RolesRow;
