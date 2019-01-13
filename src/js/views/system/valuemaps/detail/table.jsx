/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import pickBy from 'lodash/pickBy';
import includes from 'lodash/includes';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import size from 'lodash/size';

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
}: Props): React.Element<any> => (
  <Table condensed striped fixed height={300}>
    <Thead>
      <FixedRow className="toolbar-row">
        <Th>
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
        <Th iconName="info-sign"> Value </Th>
      </FixedRow>
    </Thead>
    <DataOrEmptyTable condition={size(data) === 0} cols={3} small>
      {props => (
        <Tbody {...props}>
          {Object.keys(data).map(
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
    (valuemap: Object): boolean => valuemap.id === parseInt(id, 10)
  );

  return vm && vm.vals ? vm.vals : { sync: false, loading: false, data: {} };
};

const filterValues: Function = (query: string): Function => (
  data: Object
): Object =>
  pickBy(data, (value, key) =>
    query ? includes(key, query) || includes(value.value, query) : true
  );

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
