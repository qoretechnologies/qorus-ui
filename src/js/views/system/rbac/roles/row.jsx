/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { Button, Intent, ButtonGroup } from '@blueprintjs/core';

import { Tr, Td } from '../../../../components/new_table';
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
  first: boolean,
};

const RolesRow: Function = ({
  model,
  handleEditClick,
  handleDeleteClick,
  handleCloneClick,
  canEdit,
  canDelete,
  canCreate,
  first,
}: Props): React.Element<any> => (
  <Tr first={first}>
    <Td className="name">
      <Text text={model.role} />
    </Td>
    <Td className="text">
      <Text text={model.provider} />
    </Td>
    <Td className="text">
      <Text text={model.desc} />
    </Td>
    <Td className="text medium">
      <ButtonGroup>
        {canCreate && (
          <Button
            iconName="duplicate"
            onClick={handleCloneClick}
            title="Duplicate role"
            className="pt-small"
          />
        )}
        {canEdit && (
          <Button
            iconName="edit"
            onClick={handleEditClick}
            title="Edit role"
            className="pt-small"
          />
        )}
        {canDelete && (
          <Button
            iconName="cross"
            intent={Intent.DANGER}
            onClick={handleDeleteClick}
            title="Remove role"
            className="pt-small"
          />
        )}
      </ButtonGroup>
    </Td>
  </Tr>
);

export default compose(
  withHandlers({
    handleEditClick: ({ model, onEditClick }: Props): Function => (): void => {
      onEditClick(model);
    },
    handleDeleteClick: ({
      model,
      onDeleteClick,
    }: Props): Function => (): void => {
      onDeleteClick(model.role);
    },
    handleCloneClick: ({
      model,
      onCloneClick,
    }: Props): Function => (): void => {
      onCloneClick(model);
    },
  }),
  pure(['model', 'canEdit', 'canDelete', 'canCreate'])
)(RolesRow);
