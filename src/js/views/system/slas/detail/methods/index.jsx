// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Link } from 'react-router';

import { findBy } from '../../../../../helpers/search';
import { querySelector } from '../../../../../selectors';
import queryControl from '../../../../../hocomponents/queryControl';
import withSort from '../../../../../hocomponents/sort';
import Search from '../../../../../containers/search';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  FixedRow,
} from '../../../../../components/new_table';
import Toolbar from '../../../../../components/toolbar';
import { sortDefaults } from '../../../../../constants/sort';
import NoData from '../../../../../components/nodata';

type Props = {
  sla: Object,
  methods: Array<Object>,
  changeSearchQuery: Function,
  searchQuery?: string,
  sortData: Object,
  onSortChange: Function,
};

const SLAMethods: Function = ({
  methods,
  changeSearchQuery,
  searchQuery,
  sortData,
  onSortChange,
}: Props): React.Element<any> => (
  <div>
    <Toolbar mb>
      <Search
        onSearchUpdate={changeSearchQuery}
        defaultValue={searchQuery}
        resource="sla_methods"
      />
    </Toolbar>
    {methods && methods.length > 0 ? (
      <Table fixed condensed striped>
        <Thead>
          <FixedRow {...{ sortData, onSortChange }}>
            <Th className="narrow" name="id">
              {' '}
              ID{' '}
            </Th>
            <Th className="name" name="name">
              {' '}
              Name{' '}
            </Th>
            <Th className="text normal" name="type">
              {' '}
              Type{' '}
            </Th>
          </FixedRow>
        </Thead>
        <Tbody>
          {methods.map(
            (
              { id, resource, type, name }: Object,
              idx: number
            ): React.Element<any> => (
              <Tr key={`${type}${id}`} first={idx === 0}>
                <Td className="narrow">{id}</Td>
                <Td className="name">
                  <Link
                    to={`/${resource}?paneId=${id}&paneTab=${
                      type === 'job' ? 'detail' : 'methods'
                    }`}
                  >
                    {name} ({id})
                  </Link>
                </Td>
                <Td className="text normal">{type}</Td>
              </Tr>
            )
          )}
        </Tbody>
      </Table>
    ) : (
      <NoData />
    )}
  </div>
);

const selectMethods: Function = (
  state: Object,
  { sla }: Props
): Array<Object> => [...(sla.methods || []), ...(sla.jobs || [])];

const normalizeMethods: Function = (): Function => (
  methods: Array<Object>
): Array<Object> =>
  methods.map(
    (method: Object): Object => {
      const mapped: Object = { ...method };

      if (mapped.serviceid) {
        mapped.id = mapped.serviceid;
        mapped.name = `${mapped.service_name}.${mapped.method_name}()`;
        mapped.type = 'Service';
        mapped.resource = 'services';
      } else {
        mapped.id = mapped.jobid;
        mapped.type = 'Job';
        mapped.resource = 'jobs';
      }

      return mapped;
    }
  );

const filterMethods: Function = (search: string): Function => (
  methods: Array<Object>
): Array<Object> => findBy(['name', 'type', 'id'], search, methods);

const methodsSelector: Function = createSelector(
  [querySelector('search'), selectMethods],
  (search: string, methods: Array<Object>): Object =>
    compose(
      normalizeMethods(),
      filterMethods(search)
    )(methods)
);

const viewSelector: Function = createSelector(
  [methodsSelector],
  (methods: Array<Object>): Object => ({
    methods,
  })
);

export default compose(
  connect(viewSelector),
  queryControl('search'),
  withSort('methods', 'methods', sortDefaults.slamethods),
  pure(['sla', 'methods', 'searchQuery', 'sortData'])
)(SLAMethods);
