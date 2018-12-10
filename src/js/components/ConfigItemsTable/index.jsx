// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Table, Thead, Tr, Th, Tbody, EditableCell, Td } from '../new_table';
import map from 'lodash/map';
import size from 'lodash/size';

import NameColumn, { NameColumnHeader } from '../NameColumn';
import DataOrEmptyTable from '../DataOrEmptyTable';
import { Icon, Intent, Tooltip, Position } from '@blueprintjs/core';
import actions from '../../store/api/actions';
import withDispatch from '../../hocomponents/withDispatch';
import ExpandableItem from '../ExpandableItem';
import DatePicker from '../datepicker';
import Flex from '../Flex';
import NoDataIf from '../NoDataIf';

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
  <NoDataIf condition={size(items) === 0} big>
    {() => (
      <Flex scrollY>
        {map(items, (configItems: Array<Object>, belongsTo: string) => (
          <ExpandableItem title={belongsTo} key={belongsTo} show>
            {() => (
              <Table striped condensed>
                <Thead>
                  <Tr>
                    <NameColumnHeader />
                    <Th>Default</Th>
                    <Th>Value</Th>
                    <Th>Type</Th>
                    <Th>Req.</Th>
                    <Th className="text">Description</Th>
                  </Tr>
                </Thead>

                <DataOrEmptyTable
                  condition={!configItems || configItems.length === 0}
                  cols={7}
                >
                  {props => (
                    <Tbody {...props}>
                      {configItems.map((item: Object, index: number) => (
                        <Tr key={index}>
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
      </Flex>
    )}
  </NoDataIf>
);

export default compose(
  withDispatch(),
  onlyUpdateForKeys(['items'])
)(ConfigItemsContainer);
