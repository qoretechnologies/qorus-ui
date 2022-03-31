/* @flow */
import React from 'react';
import { ActionColumn } from '../../../../components/ActionColumn';
import { Control as Button, Controls as ButtonGroup } from '../../../../components/controls';
import NameColumn from '../../../../components/NameColumn';
import { EditableCell, Tr } from '../../../../components/new_table';
import withDispatch from '../../../../hocomponents/withDispatch';
import { deleteValue, updateValue } from '../../../../store/api/resources/valuemaps/actions';

type Props = {
  data: Object;
  id: number;
  name: string;
  dispatchAction: Function;
  first: boolean;
};

const RowDetail: Function = ({
  // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'Object'.
  data: { value, enabled },
  id,
  name,
  dispatchAction,
  first,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props): React.Element<any> => {
  const handleEnableClick: Function = (): void => {
    dispatchAction(updateValue, id, name, value, !enabled);
  };

  const handleValueChange = (newValue: string | number): void => {
    dispatchAction(updateValue, id, name, newValue, enabled);
  };

  const handleRemoveClick: Function = (): void => {
    dispatchAction(deleteValue, id, name);
  };

  return (
    <Tr first={first}>
      <NameColumn name={name} />
      <ActionColumn>
        <ButtonGroup>
          <Button
            icon="power"
            btnStyle={enabled ? 'success' : 'danger'}
            onClick={handleEnableClick}
            title={enabled ? 'Disable' : 'Enable'}
          />
          <Button icon="cross" btnStyle="danger" onClick={handleRemoveClick} title="Remove value" />
        </ButtonGroup>
      </ActionColumn>
      {/* @ts-expect-error ts-migrate(2739) FIXME: Type '{ value: any; onSave: (newValue: string | nu... Remove this comment to see the full error message */}
      <EditableCell value={value} onSave={handleValueChange} />
    </Tr>
  );
};

export default withDispatch()(RowDetail);
