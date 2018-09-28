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

type Props = {
  collection: Object,
};

const UserHttp: Function = ({ collection }: Props): any => (
  <div>
    <Breadcrumbs>
      <Crumb> User HTTP Services </Crumb>
    </Breadcrumbs>
    {size(collection) ? (
      map(
        collection,
        (
          httpServices: Array<Object>,
          groupName: string
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
                    (httpService: Object, idx: number): React.Element<any> => (
                      <Tr key={idx}>
                        <Td className="text name">{httpService.title}</Td>
                        <Td className="text">
                          <Link to={httpService.URL}>{httpService.url}</Link>
                        </Td>
                        <Td className="text">{httpService.service}</Td>
                        <Td className="narrow">{httpService.version}</Td>
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
      <Box top noPadding>
        <NoData />
      </Box>
    )}
  </div>
);

const userHttpMetaSelector = (state: Object): Object => {
  if (state.api.userhttp) {
    return {
      sync: state.api.userhttp.sync,
      loading: state.api.userhttp.loading,
    };
  }

  return { sync: false, loading: false };
};

const userHttpSelector = (state: Object): Array<Object> =>
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
    { load: actions.userhttp.fetch }
  ),
  sync('meta'),
  titleManager('HTTP Services')
)(UserHttp);
