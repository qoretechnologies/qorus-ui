/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { Button, Intent, ButtonGroup } from '@blueprintjs/core';

import { Tr, Td } from '../../../../components/new_table';
import Text from '../../../../components/text';
import NameColumn from '../../../../components/NameColumn';
import { DescriptionColumn } from '../../../../components/DescriptionColumn';
import { ActionColumn } from '../../../../components/ActionColumn';

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
    <NameColumn name={model.role} />
    <ActionColumn className="medium">
      <ButtonGroup>
        {canCreate && (
          <Button
            icon="duplicate"
            onClick={handleCloneClick}
            title="Duplicate role"
            className="bp3-small"
          />
        )}
        {canEdit && (
          <Button
            icon="edit"
            onClick={handleEditClick}
            title="Edit role"
            className="bp3-small"
          />
        )}
        {canDelete && (
          <Button
            icon="cross"
            intent={Intent.DANGER}
            onClick={handleDeleteClick}
            title="Remove role"
            className="bp3-small"
          />
        )}
      </ButtonGroup>
    </ActionColumn>
    <Td className="text">
      <Text text={model.provider} />
    </Td>
    <DescriptionColumn>{model.desc}</DescriptionColumn>
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
