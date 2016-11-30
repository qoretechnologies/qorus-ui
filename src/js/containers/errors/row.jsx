/* @flow */
import React from 'react';

import { Section, Row, Td } from '../../components/table';
import { Controls, Control as Button } from '../../components/controls';
import Auto from '../../components/autocomponent';

type Props = {
  data: Object,
  compact: boolean,
  type: string,
  onEditClick: Function,
  onDeleteClick: Function,
}

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
    <Section type="body">
      <Row>
        <Td className="name">{ data.error }</Td>
        { !compact && (
          <Td className="text">{ data.description }</Td>
        )}
        <Td className="narrow">{ data.severity }</Td>
        <Td className="narrow">
          <Auto>{ data.retry_flag }</Auto>
        </Td>
        <Td>{ data.retry_delay_secs }</Td>
        <Td className="business">
          <Auto>{ data.business_flag }</Auto>
        </Td>
        { type === 'workflow' && (
          <Td className="narrow">
            <Auto>{ data.manually_updated }</Auto>
          </Td>
        )}
        <Td className="narrow">
          <Controls grouped>
            <Button
              onClick={handleEditClick}
              btnStyle="warning"
              icon="edit"
              title="Edit error"
            />
            <Button
              onClick={handleDeleteClick}
              btnStyle="danger"
              icon="times"
              title="Remove error"
            />
          </Controls>
        </Td>
      </Row>
      { compact && (
        <Row>
          <Td
            className="text error-info"
            colspan={type === 'workflow' ? 7 : 6}
          >
            { data.description}
          </Td>
        </Row>
      )}
    </Section>
  );
};

export default ErrorsRow;
