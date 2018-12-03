// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  EditableCell,
  Td,
  FixedRow,
} from '../new_table';
import NameColumn, { NameColumnHeader } from '../NameColumn';
import DataOrEmptyTable from '../DataOrEmptyTable';
import { Icon, Intent } from '@blueprintjs/core';
import actions from '../../store/api/actions';
import withDispatch from '../../hocomponents/withDispatch';

type ConfigItemsContainerProps = {
  items: Array<Object>,
  dispatchAction: Function,
};

const ConfigItemsContainer: Function = ({
  items,
  dispatchAction,
}: ConfigItemsContainerProps): React.Element<any> => (
  <Table fixed striped condensed>
    <Thead>
      <FixedRow>
        <Th>ID</Th>
        <NameColumnHeader />
        <Th>Default</Th>
        <Th>Value</Th>
        <Th>Type</Th>
        <Th>Req.</Th>
        <Th className="text">Description</Th>
      </FixedRow>
    </Thead>

    <DataOrEmptyTable condition={!items || items.length === 0} cols={6}>
      {props => (
        <Tbody {...props}>
          {items.map((item: Object, index: number) => (
            <Tr first={index === 0} key={index}>
              <Td className="narrow">{item.id}</Td>
              <NameColumn name={item.name} />
              <Td className="narrow">{item.default_value}</Td>
              <EditableCell
                value={item.value}
                onSave={(newValue: any) =>
                  dispatchAction(
                    actions.workflows.updateConfigItem,
                    item.id,
                    item.name,
                    newValue
                  )
                }
              />
              <Td className="narrow">{item.type}</Td>
              <Td className="narrow">
                <Icon
                  iconName={item.mandatory ? 'small-tick' : 'cross'}
                  intent={item.mandatory && Intent.SUCCESS}
                />
              </Td>
              <Td className="text">{item.desc}</Td>
            </Tr>
          ))}
        </Tbody>
      )}
    </DataOrEmptyTable>
  </Table>
);

export default compose(
  withDispatch(),
  onlyUpdateForKeys(['items'])
)(ConfigItemsContainer);
