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
import map from 'lodash/map';

import NameColumn, { NameColumnHeader } from '../NameColumn';
import DataOrEmptyTable from '../DataOrEmptyTable';
import { Icon, Intent, Tooltip, Position } from '@blueprintjs/core';
import actions from '../../store/api/actions';
import withDispatch from '../../hocomponents/withDispatch';
import ExpandableItem from '../ExpandableItem';
import DatePicker from '../datepicker';

type ConfigItemsContainerProps = {
  items: Object,
  dispatchAction: Function,
  intrf: string,
};

const ConfigItemsContainer: Function = ({
  items,
  dispatchAction,
  intrf,
}: ConfigItemsContainerProps): React.Element<any> => (
  <div>
    {map(items, (configItems: Array<Object>, belongsTo: string) => (
      <ExpandableItem title={belongsTo} key={belongsTo} show>
        {() => (
          <Table fixed striped condensed>
            <Thead>
              <FixedRow>
                <NameColumnHeader />
                <Th>Default</Th>
                <Th>Value</Th>
                <Th>Type</Th>
                <Th>Req.</Th>
                <Th className="text">Description</Th>
              </FixedRow>
            </Thead>

            <DataOrEmptyTable
              condition={!configItems || configItems.length === 0}
              cols={7}
            >
              {props => (
                <Tbody {...props}>
                  {configItems.map((item: Object, index: number) => (
                    <Tr first={index === 0} key={index}>
                      <NameColumn name={item.name} />
                      <Td className="text">{item.default_value}</Td>
                      {item.type === 'date' ? (
                        <Td className="large">
                          <DatePicker
                            date={item.value}
                            onApplyDate={(newValue: any) =>
                              dispatchAction(
                                actions[intrf].updateConfigItem,
                                item.id,
                                item.name,
                                newValue
                              )
                            }
                            noButtons
                            small
                          />
                        </Td>
                      ) : (
                        <EditableCell
                          className="text large"
                          value={item.value}
                          onSave={(newValue: any) =>
                            dispatchAction(
                              actions[intrf].updateConfigItem,
                              item.id,
                              item.name,
                              newValue
                            )
                          }
                        />
                      )}
                      <Td className="narrow">{item.type}</Td>
                      <Td className="narrow">
                        <Icon
                          iconName={item.mandatory ? 'small-tick' : 'cross'}
                          intent={item.mandatory && Intent.SUCCESS}
                        />
                      </Td>
                      <Td className="text">
                        <Tooltip
                          className="popover-ellipsize-content"
                          position={Position.LEFT}
                          content={item.desc}
                        >
                          {item.desc}
                        </Tooltip>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              )}
            </DataOrEmptyTable>
          </Table>
        )}
      </ExpandableItem>
    ))}
  </div>
);

export default compose(
  withDispatch(),
  onlyUpdateForKeys(['items'])
)(ConfigItemsContainer);
