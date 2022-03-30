/* @flow */
import React from 'react';

import { Tr, EditableCell } from '../../../../components/new_table';
import {
  Controls as ButtonGroup,
  Control as Button,
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
} from '../../../../components/controls';
import {
  updateValue,
  deleteValue,
} from '../../../../store/api/resources/valuemaps/actions';
import withDispatch from '../../../../hocomponents/withDispatch';
import NameColumn from '../../../../components/NameColumn';
import { ActionColumn } from '../../../../components/ActionColumn';

type Props = {
  data: Object,
  id: number,
  name: string,
  dispatchAction: Function,
  first: boolean,
};

const RowDetail: Function = ({
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'value' does not exist on type 'Object'.
  data: { value, enabled },
  id,
  name,
  dispatchAction,
  first,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => {
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
          <Button
            icon="cross"
            btnStyle="danger"
            onClick={handleRemoveClick}
            title="Remove value"
          />
        </ButtonGroup>
      </ActionColumn>
      // @ts-expect-error ts-migrate(2739) FIXME: Type '{ value: any; onSave: (newValue: string | nu... Remove this comment to see the full error message
      <EditableCell value={value} onSave={handleValueChange} />
    </Tr>
  );
};

export default withDispatch()(RowDetail);
