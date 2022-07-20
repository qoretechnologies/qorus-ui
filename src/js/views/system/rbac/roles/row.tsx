/* @flow */
import { Button, ButtonGroup, Intent } from '@blueprintjs/core';
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { ActionColumn } from '../../../../components/ActionColumn';
import { DescriptionColumn } from '../../../../components/DescriptionColumn';
import NameColumn from '../../../../components/NameColumn';
import { Td, Tr } from '../../../../components/new_table';
import Text from '../../../../components/text';

type Props = {
  model: any;
  onEditClick: Function;
  onDeleteClick: Function;
  onCloneClick: Function;
  handleEditClick: Function;
  handleDeleteClick: Function;
  handleCloneClick: Function;
  canEdit: boolean;
  canDelete: boolean;
  canCreate: boolean;
  first: boolean;
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
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <Tr first={first}>
    {/* @ts-ignore ts-migrate(2339) FIXME: Property 'role' does not exist on type 'Object'. */}
    <NameColumn name={model.role} />
    <ActionColumn className="medium">
      <ButtonGroup>
        {canCreate && (
          <Button
            icon="duplicate"
            // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type '((event... Remove this comment to see the full error message
            onClick={handleCloneClick}
            title="Duplicate role"
            className="bp3-small"
          />
        )}
        {canEdit && (
          <Button
            icon="edit"
            // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type '((event... Remove this comment to see the full error message
            onClick={handleEditClick}
            title="Edit role"
            className="bp3-small"
          />
        )}
        {canDelete && (
          <Button
            icon="cross"
            intent={Intent.DANGER}
            // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type '((event... Remove this comment to see the full error message
            onClick={handleDeleteClick}
            title="Remove role"
            className="bp3-small"
          />
        )}
      </ButtonGroup>
    </ActionColumn>
    <Td className="text">
      {/* @ts-ignore ts-migrate(2339) FIXME: Property 'provider' does not exist on type 'Object... Remove this comment to see the full error message */}
      <Text text={model.provider} />
    </Td>
    {/* @ts-ignore ts-migrate(2339) FIXME: Property 'desc' does not exist on type 'Object'. */}
    <DescriptionColumn>{model.desc}</DescriptionColumn>
  </Tr>
);

export default compose(
  withHandlers({
    handleEditClick:
      ({ model, onEditClick }: Props): Function =>
      (): void => {
        onEditClick(model);
      },
    handleDeleteClick:
      ({ model, onDeleteClick }: Props): Function =>
      (): void => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'role' does not exist on type 'Object'.
        onDeleteClick(model.role);
      },
    handleCloneClick:
      ({ model, onCloneClick }: Props): Function =>
      (): void => {
        onCloneClick(model);
      },
  }),
  pure(['model', 'canEdit', 'canDelete', 'canCreate'])
)(RolesRow);
