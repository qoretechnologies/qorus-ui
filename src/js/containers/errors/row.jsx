/* @flow */
import React from 'react';

import { Tr, Td } from '../../components/new_table';
import { Controls, Control as Button } from '../../components/controls';
import Auto from '../../components/autocomponent';
import Text from '../../components/text';
import NameColumn from '../../components/NameColumn';
import { DescriptionColumn } from '../../components/DescriptionColumn';
import ContentByType from '../../components/ContentByType';
import { ActionColumn } from '../../components/ActionColumn';

type Props = {
  data: Object,
  compact: boolean,
  type: string,
  onEditClick: Function,
  onDeleteClick: Function,
  first: boolean,
};

const ErrorsRow: Function = ({
  data,
  compact,
  type,
  onEditClick,
  onDeleteClick,
  first,
}: Props): React.Element<any> => {
  const handleEditClick: Function = () => {
    onEditClick(data);
  };

  const handleDeleteClick: Function = () => {
    onDeleteClick(data.error);
  };

  return (
    <Tr first={first} observeElement={first && '.pane'}>
      <NameColumn name={data.error} />
      <ActionColumn>
        <Controls grouped>
          <Button
            onClick={handleEditClick}
            iconName="edit"
            title="Edit error"
          />
          <Button
            onClick={handleDeleteClick}
            btnStyle="danger"
            iconName="cross"
            title="Remove error"
          />
        </Controls>
      </ActionColumn>
      {!compact && <DescriptionColumn>{data.description}</DescriptionColumn>}
      <Td className="medium">{data.severity}</Td>
      <Td className="medium">{data.status}</Td>
      <Td className="narrow">{data.retry_delay_secs}</Td>
      <Td className="medium">
        <ContentByType content={data.business_flag} />
      </Td>
      {type === 'workflow' && (
        <Td className="medium">
          <ContentByType content={data.manually_updated} />
        </Td>
      )}
    </Tr>
  );
};

export default ErrorsRow;
