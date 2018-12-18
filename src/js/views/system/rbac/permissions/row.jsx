/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { ButtonGroup, Button, Intent } from '@blueprintjs/core';

import { Tr, Td } from '../../../../components/new_table';
import { Controls, Control } from '../../../../components/controls';
import Text from '../../../../components/text';
import { ActionColumn } from '../../../../components/ActionColumn';
import { DescriptionColumn } from '../../../../components/DescriptionColumn';
import NameColumn from '../../../../components/NameColumn';

type Props = {
  model: Object,
  onEditClick: Function,
  handleEditClick: Function,
  onDeleteClick: Function,
  handleDeleteClick: Function,
  canEdit: boolean,
  canDelete: boolean,
  first: boolean,
};

const PermsRow: Function = ({
  model,
  handleEditClick,
  handleDeleteClick,
  canEdit,
  canDelete,
  first,
}: Props): React.Element<any> => (
  <Tr first={first}>
    <NameColumn name={model.name} />
    <Td className="text normal">{model.permission_type}</Td>
    <DescriptionColumn>{model.desc}</DescriptionColumn>
    <ActionColumn>
      <ButtonGroup>
        {canEdit && model.permission_type !== 'SYSTEM' && (
          <Button
            iconName="edit"
            onClick={handleEditClick}
            title="Edit permission"
            className="pt-small"
          />
        )}
        {canDelete && model.permission_type !== 'SYSTEM' && (
          <Button
            iconName="cross"
            intent={Intent.DANGER}
            onClick={handleDeleteClick}
            title="Remove permission"
            className="pt-small"
          />
        )}
      </ButtonGroup>
    </ActionColumn>
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
      onDeleteClick(model.name);
    },
  }),
  pure(['model'])
)(PermsRow);
