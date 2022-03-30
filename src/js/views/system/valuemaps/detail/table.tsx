/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import pickBy from 'lodash/pickBy';
import includes from 'lodash/includes';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import size from 'lodash/size';
import AddValue from './add';

import Search from '../../../../containers/search';

import {
  Table,
  Thead,
  Tbody,
  Th,
  FixedRow,
} from '../../../../components/new_table';
import sync from '../../../../hocomponents/sync';
import patch from '../../../../hocomponents/patchFuncArgs';
import { resourceSelector, querySelector } from '../../../../selectors';
import { fetchValues } from '../../../../store/api/resources/valuemaps/actions';
import DetailRow from './row';
import Pull from '../../../../components/Pull';
import { NameColumnHeader } from '../../../../components/NameColumn';
import { ActionColumnHeader } from '../../../../components/ActionColumn';
import DataOrEmptyTable from '../../../../components/DataOrEmptyTable';

type Props = {
  paneId: number,
  data: Object,
  onSortChange: Function,
  sortData: Object,
  update: Function,
  remove: Function,
  onSearchChange: Function,
  defaultSearchValue?: string,
};

const DetailTable: Function = ({
  paneId,
  data,
  onSearchChange,
  defaultSearchValue,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'onSaveClick' does not exist on type 'Pro... Remove this comment to see the full error message
  onSaveClick,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  <Table condensed striped fixed>
    <Thead>
      <FixedRow className="toolbar-row">
        <Th>
          <Pull>
            <AddValue id={paneId} add={onSaveClick} />
          </Pull>
          <Pull right>
            <Search
              onSearchUpdate={onSearchChange}
              defaultValue={defaultSearchValue}
              resource="valuemapKeys"
            />
          </Pull>
        </Th>
      </FixedRow>
      <FixedRow>
        <NameColumnHeader />
        <ActionColumnHeader />
        <Th icon="info-sign"> Value </Th>
      </FixedRow>
    </Thead>
    <DataOrEmptyTable condition={size(data) === 0} cols={3} small>
      {props => (
        <Tbody {...props}>
          {Object.keys(data).map(
            // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
            (key: string, index: number): React.Element<any> => (
              <DetailRow
                key={index}
                id={paneId}
                name={key}
                first={index === 0}
                data={data[key]}
              />
            )
          )}
        </Tbody>
      )}
    </DataOrEmptyTable>
  </Table>
);

const findValuemap: Function = (id: number): Function => (
  data: Array<Object>
): Object => {
  const vm = data.find(
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
    (valuemap: Object): boolean => valuemap.id === parseInt(id, 10)
  );

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'vals' does not exist on type 'Object'.
  return vm && vm.vals ? vm.vals : { sync: false, loading: false, data: {} };
};

const filterValues: Function = (query: string): Function => (
  data: Object
): Object =>
  pickBy(data, (value, key) =>
    query ? includes(key, query) || includes(value.value, query) : true
  );

// @ts-expect-error ts-migrate(2339) FIXME: Property 'paneId' does not exist on type 'Object'.
const valuemapId = (state: Object, props: Object): number => props.paneId;

const collectionSelector = createSelector(
  [resourceSelector('valuemaps'), valuemapId],
  (valuemaps, id) => compose(findValuemap(id))(valuemaps.data)
);

const valuesSelector = createSelector(
  [collectionSelector, querySelector('values')],
  (values, query) => filterValues(query)(values.data)
);

const selector = createSelector(
  [collectionSelector, valuesSelector, querySelector('values')],
  (collection, data) => ({
    data,
    collection,
  })
);

export default compose(
  connect(
    selector,
    {
      load: fetchValues,
    }
  ),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (this.props.paneId !== nextProps.paneId) {
        this.props.load(nextProps.paneId);
      }
    },
  }),
  patch('load', ['paneId']),
  sync('collection')
)(DetailTable);
