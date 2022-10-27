/* @flow */
import map from 'lodash/map';
import size from 'lodash/size';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import compose from 'recompose/compose';
import { createSelector } from 'reselect';
import Box from '../../../components/box';
import { Breadcrumbs, Crumb } from '../../../components/breadcrumbs';
import Flex from '../../../components/Flex';
import Headbar from '../../../components/Headbar';
import { Table, Tbody, Td, Th, Thead, Tr } from '../../../components/new_table';
import NoData from '../../../components/nodata';
import PaneItem from '../../../components/pane_item';
import sync from '../../../hocomponents/sync';
import titleManager from '../../../hocomponents/TitleManager';
import actions from '../../../store/api/actions';

type Props = {
  collection: any;
};

const UserHttp: Function = ({ collection }: Props): any => (
  <Flex id="http-services-view">
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
          // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
        ) => (
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
                    // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
                    (httpService: any, idx: number) => (
                      <Tr key={idx}>
                        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'title' does not exist on type 'Object'. */}
                        <Td className="text name">{httpService.title}</Td>
                        <Td className="text">
                          {/* @ts-ignore ts-migrate(2339) FIXME: Property 'URL' does not exist on type 'Object'. */}
                          <Link to={httpService.URL}>{httpService.url}</Link>
                        </Td>
                        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'service' does not exist on type 'Object'... Remove this comment to see the full error message */}
                        <Td className="text">{httpService.service}</Td>
                        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'version' does not exist on type 'Object'... Remove this comment to see the full error message */}
                        <Td className="narrow">{httpService.version}</Td>
                        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'serviceid' does not exist on type 'Objec... Remove this comment to see the full error message */}
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

const userHttpMetaSelector = (state: any): any => {
  // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
  if (state.api.userhttp) {
    return {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      sync: state.api.userhttp.sync,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      loading: state.api.userhttp.loading,
    };
  }

  return { sync: false, loading: false };
};

const userHttpSelector = (state: any): Array<Object> =>
  // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
  state.api.userhttp.data;

const viewSelector = createSelector(
  [userHttpSelector, userHttpMetaSelector],
  (userhttp: Array<Object>, meta: any) => ({
    meta,
    collection: userhttp,
  })
);

export default compose(
  connect(
    viewSelector,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'userhttp' does not exist on type '{}'.
    { load: actions.userhttp.fetch }
  ),
  sync('meta'),
  titleManager('HTTP Services')
)(UserHttp);
