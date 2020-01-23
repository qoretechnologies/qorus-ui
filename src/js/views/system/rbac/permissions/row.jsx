/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { ButtonGroup, Button, Intent } from '@blueprintjs/core';

import { Tr, Td } from '../../../../components/new_table';
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
    <ActionColumn>
      <ButtonGroup>
        <Button
          disabled={!(canEdit && model.permission_type !== 'SYSTEM')}
          icon="edit"
          onClick={handleEditClick}
          title="Edit permission"
          className="bp3-small"
        />
        <Button
          disabled={!(canDelete && model.permission_type !== 'SYSTEM')}
          icon="cross"
          intent={Intent.DANGER}
          onClick={handleDeleteClick}
          title="Remove permission"
          className="bp3-small"
        />
      </ButtonGroup>
    </ActionColumn>
    <Td className="text normal">{model.permission_type}</Td>
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
      onDeleteClick(model.name);
    },
  }),
  pure(['model'])
)(PermsRow);
