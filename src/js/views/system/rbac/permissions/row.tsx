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

type Props = {
  model: any;
  onEditClick: Function;
  handleEditClick: Function;
  onDeleteClick: Function;
  handleDeleteClick: Function;
  canEdit: boolean;
  canDelete: boolean;
  first: boolean;
};

const PermsRow: Function = ({
  model,
  handleEditClick,
  handleDeleteClick,
  canEdit,
  canDelete,
  first,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <Tr first={first}>
    {/* @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'. */}
    <NameColumn name={model.name} />
    <ActionColumn>
      <ButtonGroup>
        <Button
          // @ts-ignore ts-migrate(2339) FIXME: Property 'permission_type' does not exist on type ... Remove this comment to see the full error message
          disabled={!(canEdit && model.permission_type !== 'SYSTEM')}
          icon="edit"
          // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type '((event... Remove this comment to see the full error message
          onClick={handleEditClick}
          title="Edit permission"
          className="bp3-small"
        />
        <Button
          // @ts-ignore ts-migrate(2339) FIXME: Property 'permission_type' does not exist on type ... Remove this comment to see the full error message
          disabled={!(canDelete && model.permission_type !== 'SYSTEM')}
          icon="cross"
          intent={Intent.DANGER}
          // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type '((event... Remove this comment to see the full error message
          onClick={handleDeleteClick}
          title="Remove permission"
          className="bp3-small"
        />
      </ButtonGroup>
    </ActionColumn>
    {/* @ts-ignore ts-migrate(2339) FIXME: Property 'permission_type' does not exist on type ... Remove this comment to see the full error message */}
    <Td className="text normal">{model.permission_type}</Td>
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
        // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
        onDeleteClick(model.name);
      },
  }),
  pure(['model'])
)(PermsRow);
