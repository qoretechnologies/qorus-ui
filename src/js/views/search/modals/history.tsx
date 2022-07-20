// @flow
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import AutoComp from '../../../components/autocomponent';
import Box from '../../../components/box';
import ContentByType from '../../../components/ContentByType';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Control as Button } from '../../../components/controls';
import ButtonGroup from '../../../components/controls/controls';
import DataOrEmptyTable from '../../../components/DataOrEmptyTable';
import Modal from '../../../components/modal';
import { FixedRow, Table, Tbody, Td, Th, Thead, Tr } from '../../../components/new_table';
import Text from '../../../components/text';
import queryControl from '../../../hocomponents/queryControl';

type Props = {
  history: Array<string>;
  type: string;
  storage: any;
  onClose: Function;
  data: string;
  changeAllQuery: Function;
  first?: boolean;
};

let SearchHistoryRow: Function = ({
  data,
  type,
  changeAllQuery,
  onClose,
  first,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => {
  const item: any = JSON.parse(data);
  const handleClick: Function = () => {
    changeAllQuery(item);
    onClose();
  };

  return (
    <Tr first={first}>
      <Td className="text medium">
        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'ids' does not exist on type 'Object'. */}
        <Text text={item.ids} />
      </Td>
      <Td className="text medium">
        {type === 'ordersSearch' ? (
          // @ts-ignore ts-migrate(2339) FIXME: Property 'keyname' does not exist on type 'Object'... Remove this comment to see the full error message
          <Text text={item.keyname} />
        ) : (
          // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
          <Text text={item.name} />
        )}
      </Td>
      <Td className="text medium">
        {type === 'ordersSearch' ? (
          // @ts-ignore ts-migrate(2339) FIXME: Property 'keyvalue' does not exist on type 'Object... Remove this comment to see the full error message
          <Text text={item.keyvalue} />
        ) : (
          // @ts-ignore ts-migrate(2339) FIXME: Property 'error' does not exist on type 'Object'.
          <Text text={item.error} />
        )}
      </Td>
      <Td className="text big">
        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'mindate' does not exist on type 'Object'... Remove this comment to see the full error message */}
        <ContentByType content={item.mindate} />
      </Td>
      <Td className="text big">
        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'maxdate' does not exist on type 'Object'... Remove this comment to see the full error message */}
        <ContentByType content={item.maxdate} />
      </Td>
      {type !== 'ordersSearch' && (
        <Td className="narrow">
          {/* @ts-ignore ts-migrate(2339) FIXME: Property 'retry' does not exist on type 'Object'. */}
          <AutoComp>{item.retry && item.retry !== ''}</AutoComp>
        </Td>
      )}
      {type !== 'ordersSearch' && (
        <Td className="narrow">
          {/* @ts-ignore ts-migrate(2339) FIXME: Property 'busErr' does not exist on type 'Object'. */}
          <AutoComp>{item.busErr && item.busErr !== ''}</AutoComp>
        </Td>
      )}
      <Td className="text">
        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'filter' does not exist on type 'Object'. */}
        <Text text={item.filter} />
      </Td>
      <Td className="narrow">
        <ButtonGroup>
          <Button label="Apply" btnStyle="success" onClick={handleClick} />
        </ButtonGroup>
      </Td>
    </Tr>
  );
};

// @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 0.
SearchHistoryRow = queryControl()(SearchHistoryRow);

const SearchHistory: Function = ({
  history,
  type,
  onClose,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
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
              <Th className="text medium">{type === 'ordersSearch' ? 'Keyname' : 'Name'}</Th>
              <Th className="text medium">{type === 'ordersSearch' ? 'Keyvalue' : 'Error'}</Th>
              <Th className="big">Min. Date</Th>
              <Th className="big">Max. Date</Th>
              {type !== 'ordersSearch' && <Th className="narrow">Retry</Th>}
              {type !== 'ordersSearch' && <Th className="narrow">Bus. Err.</Th>}
              <Th className="text">Filters</Th>
              <Th className="narrow">-</Th>
            </FixedRow>
          </Thead>
          <DataOrEmptyTable condition={history.length === 0} cols={type === 'ordersSearch' ? 7 : 9}>
            {(props) => (
              <Tbody {...props}>
                {history.map(
                  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
                  (data: string, key: number) => (
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
  connect((state: any): any => ({
    // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
    storage: state.api.currentUser.data.storage,
  })),
  mapProps(
    ({ storage, type, ...rest }: Props): Props => ({
      history: storage[type] && storage[type].searches ? storage[type].searches : [],
      storage,
      type,
      ...rest,
    })
  ),
  pure(['history'])
)(SearchHistory);
