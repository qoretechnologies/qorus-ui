/* @flow */
import { Button, ButtonGroup, Intent } from '@blueprintjs/core';
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { ActionColumn } from '../../../../components/ActionColumn';
import Badge from '../../../../components/badge';
import NameColumn from '../../../../components/NameColumn';
import { Td, Tr } from '../../../../components/new_table';
import Text from '../../../../components/text';


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
      {model.roles?.map((role, index) => (
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
