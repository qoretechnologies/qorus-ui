/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { Button, Intent, ButtonGroup } from '@blueprintjs/core';

import { Tr, Td } from '../../../../components/new_table';
import Badge from '../../../../components/badge';
import Text from '../../../../components/text';
import NameColumn from '../../../../components/NameColumn';
import { ActionColumn } from '../../../../components/ActionColumn';

type Props = {
  model: Object,
  canEdit: boolean,
  onEditClick: Function,
  handleEditClick: Function,
  canDelete: boolean,
  onDeleteClick: Function,
  handleDeleteClick: Function,
  first: boolean,
};

const UsersRow: Function = ({
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
          disabled={!canEdit}
          icon="edit"
          onClick={handleEditClick}
          title="Edit user"
          className="bp3-small"
        />
        <Button
          disabled={!canDelete}
          icon="cross"
          intent={Intent.DANGER}
          onClick={handleDeleteClick}
          title="Remove user"
          className="bp3-small"
        />
      </ButtonGroup>
    </ActionColumn>
    <Td className="text big">
      <Text text={model.username} />
    </Td>
    <Td className="text">
      {model.roles.map((role, index) => (
        <Badge key={index} val={role} label="info" />
      ))}
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
      onDeleteClick(model.username);
    },
  }),
  pure(['model'])
)(UsersRow);
