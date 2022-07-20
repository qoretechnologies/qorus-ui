/* @flow */
import React from 'react';
import { ActionColumn } from '../../components/ActionColumn';
import ContentByType from '../../components/ContentByType';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Control as Button, Controls } from '../../components/controls';
import { DescriptionColumn } from '../../components/DescriptionColumn';
import NameColumn from '../../components/NameColumn';
import { Td, Tr } from '../../components/new_table';

type Props = {
  data: any;
  compact: boolean;
  type: string;
  onEditClick: Function;
  onDeleteClick: Function;
  first: boolean;
};

const ErrorsRow: Function = ({
  data,
  compact,
  type,
  onEditClick,
  onDeleteClick,
  first,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => {
  const handleEditClick: Function = () => {
    onEditClick(data);
  };

  const handleDeleteClick: Function = () => {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'error' does not exist on type 'Object'.
    onDeleteClick(data.error);
  };

  return (
    <Tr first={first}>
      {/* @ts-ignore ts-migrate(2339) FIXME: Property 'error' does not exist on type 'Object'. */}
      <NameColumn name={data.error} />
      <ActionColumn>
        <Controls grouped>
          <Button onClick={handleEditClick} icon="edit" title="Edit error" />
          <Button onClick={handleDeleteClick} btnStyle="danger" icon="cross" title="Remove error" />
        </Controls>
      </ActionColumn>
      {/* @ts-ignore ts-migrate(2339) FIXME: Property 'description' does not exist on type 'Obj... Remove this comment to see the full error message */}
      {!compact && <DescriptionColumn>{data.description}</DescriptionColumn>}
      {/* @ts-ignore ts-migrate(2339) FIXME: Property 'severity' does not exist on type 'Object... Remove this comment to see the full error message */}
      <Td className="medium">{data.severity}</Td>
      {/* @ts-ignore ts-migrate(2339) FIXME: Property 'status' does not exist on type 'Object'. */}
      <Td className="medium">{data.status}</Td>
      {/* @ts-ignore ts-migrate(2339) FIXME: Property 'retry_delay_secs' does not exist on type... Remove this comment to see the full error message */}
      <Td className="narrow">{data.retry_delay_secs}</Td>
      <Td className="medium">
        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'business_flag' does not exist on type 'O... Remove this comment to see the full error message */}
        <ContentByType content={data.business_flag} />
      </Td>
      {type === 'workflow' && (
        <Td className="medium">
          {/* @ts-ignore ts-migrate(2339) FIXME: Property 'manually_updated' does not exist on type... Remove this comment to see the full error message */}
          <ContentByType content={data.manually_updated} />
        </Td>
      )}
    </Tr>
  );
};

export default ErrorsRow;
