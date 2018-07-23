/* @flow */
import React from 'react';

import { Tr, Td } from '../../components/new_table';
import { Controls, Control as Button } from '../../components/controls';
import Auto from '../../components/autocomponent';
import Text from '../../components/text';

type Props = {
  data: Object,
  compact: boolean,
  type: string,
  onEditClick: Function,
  onDeleteClick: Function,
};

const ErrorsRow: Function = ({
  data,
  compact,
  type,
  onEditClick,
  onDeleteClick,
}: Props): React.Element<any> => {
  const handleEditClick: Function = () => {
    onEditClick(data);
  };

  const handleDeleteClick: Function = () => {
    onDeleteClick(data.error);
  };

  return (
    <Tr>
      <Td className="name">
        <p>{data.error}</p>
      </Td>
      {!compact && (
        <Td className="text">
          <Text text={data.description} />
        </Td>
      )}
      <Td className="medium">{data.severity}</Td>
      <Td className="medium">
        <Auto>{data.status}</Auto>
      </Td>
      <Td className="narrow">{data.retry_delay_secs}</Td>
      <Td className="medium">
        <Auto>{data.business_flag}</Auto>
      </Td>
      {type === 'workflow' && (
        <Td className="medium">
          <Auto>{data.manually_updated}</Auto>
        </Td>
      )}
      <Td className="medium">
        <Controls grouped>
          <Button
            onClick={handleEditClick}
            btnStyle="warning"
            iconName="edit"
            title="Edit error"
          />
          <Button
            onClick={handleDeleteClick}
            btnStyle="danger"
            iconName="times"
            title="Remove error"
          />
        </Controls>
      </Td>
    </Tr>
  );
};

export default ErrorsRow;
