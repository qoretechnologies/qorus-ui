/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';

import { Tr, Td } from '../../../../components/new_table';
import { Controls, Control } from '../../../../components/controls';
import Text from '../../../../components/text';

type Props = {
  model: Object,
  onEditClick: Function,
  onDeleteClick: Function,
  onCloneClick: Function,
  handleEditClick: Function,
  handleDeleteClick: Function,
  handleCloneClick: Function,
  canEdit: boolean,
  canDelete: boolean,
  canCreate: boolean,
}

const RolesRow: Function = ({
  model,
  handleEditClick,
  handleDeleteClick,
  handleCloneClick,
  canEdit,
  canDelete,
  canCreate,
}: Props): React.Element<any> => (
  <Tr>
    <Td className="medium">
      <Controls grouped>
        { canEdit && (
          <Control
            icon="edit"
            btnStyle="warning"
            action={handleEditClick}
            title="Edit role"
          />
        )}
        { canDelete && (
          <Control
            icon="close"
            btnStyle="danger"
            action={handleDeleteClick}
            title="Remove role"
          />
        )}
        { canCreate && (
          <Control
            icon="copy"
            btnStyle="success"
            action={handleCloneClick}
            title="Duplicate role"
          />
        )}
      </Controls>
    </Td>
    <Td className="name">
      <Text text={model.role} />
    </Td>
    <Td className="text">
      <Text text={model.provider} />
    </Td>
    <Td className="text">
      <Text text={model.desc} />
    </Td>
  </Tr>
);

export default compose(
  withHandlers({
    handleEditClick: ({ model, onEditClick }: Props): Function => (): void => {
      onEditClick(model);
    },
    handleDeleteClick: ({ model, onDeleteClick }: Props): Function => (): void => {
      onDeleteClick(model.role);
    },
    handleCloneClick: ({ model, onCloneClick }: Props): Function => (): void => {
      onCloneClick(model);
    },
  }),
  pure([
    'model',
    'canEdit',
    'canDelete',
    'canCreate',
  ])
)(RolesRow);
