/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import compose from 'recompose/compose';
import map from 'lodash/map';
import size from 'lodash/size';

import { Table, Thead, Tbody, Tr, Th, Td } from '../../../components/new_table';
import actions from '../../../store/api/actions';
import sync from '../../../hocomponents/sync';
import titleManager from '../../../hocomponents/TitleManager';
import { Breadcrumbs, Crumb } from '../../../components/breadcrumbs';
import Box from '../../../components/box';
import PaneItem from '../../../components/pane_item';
import { Link } from 'react-router';
import NoData from '../../../components/nodata';
import Headbar from '../../../components/Headbar';
import Flex from '../../../components/Flex';

type Props = {
  collection: Object,
};

const UserHttp: Function = ({ collection }: Props): any => (
  <Flex>
    <Headbar>
      <Breadcrumbs>
        <Crumb active> User HTTP Services </Crumb>
      </Breadcrumbs>
    </Headbar>
    {size(collection) ? (
      map(
        collection,
        (
          httpServices: Array<Object>,
          groupName: string
        // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
        ): React.Element<Box> => (
          <Box>
            <PaneItem title={groupName}>
              <Table condensed striped hover>
                <Thead>
                  <Tr>
                    <Th className="text name">Title</Th>
                    <Th className="text">URL</Th>
                    <Th className="text">Service</Th>
                    <Th className="narrow">Version</Th>
                    <Th className="narrow">ID</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {httpServices.map(
                    // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
                    (httpService: Object, idx: number): React.Element<any> => (
                      <Tr key={idx}>
                        { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'title' does not exist on type 'Object'. */ }
                        <Td className="text name">{httpService.title}</Td>
                        <Td className="text">
                          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'URL' does not exist on type 'Object'. */ }
                          <Link to={httpService.URL}>{httpService.url}</Link>
                        </Td>
                        { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'service' does not exist on type 'Object'... Remove this comment to see the full error message */ }
                        <Td className="text">{httpService.service}</Td>
                        { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'version' does not exist on type 'Object'... Remove this comment to see the full error message */ }
                        <Td className="narrow">{httpService.version}</Td>
                        { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'serviceid' does not exist on type 'Objec... Remove this comment to see the full error message */ }
                        <Td className="narrow">{httpService.serviceid}</Td>
                      </Tr>
                    )
                  )}
                </Tbody>
              </Table>
            </PaneItem>
          </Box>
        )
      )
    ) : (
      <NoData big inBox top />
    )}
  </Flex>
);

const userHttpMetaSelector = (state: Object): Object => {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
  if (state.api.userhttp) {
    return {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      sync: state.api.userhttp.sync,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      loading: state.api.userhttp.loading,
    };
  }

  return { sync: false, loading: false };
};

const userHttpSelector = (state: Object): Array<Object> =>
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
  state.api.userhttp.data;

const viewSelector = createSelector(
  [userHttpSelector, userHttpMetaSelector],
  (userhttp: Array<Object>, meta: Object) => ({
    meta,
    collection: userhttp,
  })
);

export default compose(
  connect(
    viewSelector,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'userhttp' does not exist on type '{}'.
    { load: actions.userhttp.fetch }
  ),
  sync('meta'),
  titleManager('HTTP Services')
)(UserHttp);
