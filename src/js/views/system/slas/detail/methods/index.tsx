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
import Flex from '../../../../../components/Flex';

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
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  <Flex>
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
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
              { id, resource, type, name }: Object,
              idx: number
            // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
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
  </Flex>
);

const selectMethods: Function = (
  state: Object,
  { sla }: Props
// @ts-expect-error ts-migrate(2339) FIXME: Property 'methods' does not exist on type 'Object'... Remove this comment to see the full error message
): Array<Object> => [...(sla.methods || []), ...(sla.jobs || [])];

const normalizeMethods: Function = (): Function => (
  methods: Array<Object>
): Array<Object> =>
  methods.map(
    (method: Object): Object => {
      const mapped: Object = { ...method };

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'serviceid' does not exist on type 'Objec... Remove this comment to see the full error message
      if (mapped.serviceid) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
        mapped.id = mapped.serviceid;
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
        mapped.name = `${mapped.service_name}.${mapped.method_name}()`;
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
        mapped.type = 'Service';
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'resource' does not exist on type 'Object... Remove this comment to see the full error message
        mapped.resource = 'services';
      } else {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
        mapped.id = mapped.jobid;
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
        mapped.type = 'Job';
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'resource' does not exist on type 'Object... Remove this comment to see the full error message
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

// @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
const viewSelector: Function = createSelector(
  [methodsSelector],
  (methods: Array<Object>): Object => ({
    methods,
  })
);

export default compose(
  connect(viewSelector),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('search'),
  withSort('methods', 'methods', sortDefaults.slamethods),
  pure(['sla', 'methods', 'searchQuery', 'sortData'])
)(SLAMethods);
