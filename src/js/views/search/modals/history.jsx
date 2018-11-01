// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import mapProps from 'recompose/mapProps';
import { connect } from 'react-redux';

import Modal from '../../../components/modal';
import Text from '../../../components/text';
import Date from '../../../components/date';
import AutoComp from '../../../components/autocomponent';
import {
  Table,
  Thead,
  Tbody,
  FixedRow,
  Tr,
  Th,
  Td,
} from '../../../components/new_table';
import queryControl from '../../../hocomponents/queryControl';
import { Control as Button } from '../../../components/controls';
import Box from '../../../components/box';
import DataOrEmptyTable from '../../../components/DataOrEmptyTable';

type Props = {
  history: Array<string>,
  type: string,
  storage: Object,
  onClose: Function,
  data: string,
  changeAllQuery: Function,
  first?: boolean,
};

let SearchHistoryRow: Function = ({
  data,
  type,
  changeAllQuery,
  onClose,
  first,
}: Props): React.Element<any> => {
  const item: Object = JSON.parse(data);
  const handleClick: Function = () => {
    changeAllQuery(item);
    onClose();
  };

  return (
    <Tr first={first}>
      <Td className="text medium">
        <Text text={item.ids} />
      </Td>
      <Td className="text medium">
        {type === 'ordersSearch' ? (
          <Text text={item.keyname} />
        ) : (
          <Text text={item.name} />
        )}
      </Td>
      <Td className="text medium">
        {type === 'ordersSearch' ? (
          <Text text={item.keyvalue} />
        ) : (
          <Text text={item.error} />
        )}
      </Td>
      <Td className="text big">
        <Date date={item.mindate} />
      </Td>
      <Td className="text big">
        <Date date={item.maxdate} />
      </Td>
      {type !== 'ordersSearch' && (
        <Td className="narrow">
          <AutoComp>{item.retry && item.retry !== ''}</AutoComp>
        </Td>
      )}
      {type !== 'ordersSearch' && (
        <Td className="narrow">
          <AutoComp>{item.busErr && item.busErr !== ''}</AutoComp>
        </Td>
      )}
      <Td className="text">
        <Text text={item.filter} />
      </Td>
      <Td className="narrow">
        <Button label="Apply" btnStyle="success" onClick={handleClick} />
      </Td>
    </Tr>
  );
};

SearchHistoryRow = queryControl()(SearchHistoryRow);

const SearchHistory: Function = ({
  history,
  type,
  onClose,
}: Props): React.Element<any> => (
  <Modal size="lg" width="90vw">
    <Modal.Header titleId="historysearch" onClose={onClose}>
      Search history
    </Modal.Header>
    <Modal.Body>
      <Box top noPadding>
        <Table fixed condensed striped hover>
          <Thead>
            <FixedRow>
              <Th className="text medium">IDs</Th>
              <Th className="text medium">
                {type === 'ordersSearch' ? 'Keyname' : 'Name'}
              </Th>
              <Th className="text medium">
                {type === 'ordersSearch' ? 'Keyvalue' : 'Error'}
              </Th>
              <Th className="big">Min. Date</Th>
              <Th className="big">Max. Date</Th>
              {type !== 'ordersSearch' && <Th className="narrow">Retry</Th>}
              {type !== 'ordersSearch' && <Th className="narrow">Bus. Err.</Th>}
              <Th className="text">Filters</Th>
              <Th className="narrow">-</Th>
            </FixedRow>
          </Thead>
          <DataOrEmptyTable
            condition={history.length === 0}
            cols={type === 'ordersSearch' ? 7 : 9}
          >
            {props => (
              <Tbody {...props}>
                {history.map(
                  (data: string, key: number): React.Element<any> => (
                    <SearchHistoryRow
                      first={key === 0}
                      key={key}
                      data={data}
                      type={type}
                      onClose={onClose}
                    />
                  )
                )}
              </Tbody>
            )}
          </DataOrEmptyTable>
        </Table>
      </Box>
    </Modal.Body>
  </Modal>
);

export default compose(
  connect(
    (state: Object): Object => ({
      storage: state.api.currentUser.data.storage,
    })
  ),
  mapProps(
    ({ storage, type, ...rest }: Props): Props => ({
      history:
        storage[type] && storage[type].searches ? storage[type].searches : [],
      storage,
      type,
      ...rest,
    })
  ),
  pure(['history'])
)(SearchHistory);
