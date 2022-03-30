// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import SLAToolbar from './toolbar';
import SLATable from './table';
import sync from '../../../hocomponents/sync';
import withSort from '../../../hocomponents/sort';
import Box from '../../../components/box';
import unsync from '../../../hocomponents/unsync';
import actions from '../../../store/api/actions';
import { resourceSelector, querySelector } from '../../../selectors';
import { findBy } from '../../../helpers/search';
import { sortDefaults } from '../../../constants/sort';
import titleManager from '../../../hocomponents/TitleManager';
import Flex from '../../../components/Flex';

type Props = {
  location: Object,
  sortData: Object,
  collection: Array<Object>,
  onSortChange: Function,
  create: Function,
  perms: Array<Object>,
};

const Slas: Function = ({
  location,
  sortData,
  collection,
  onSortChange,
  create,
  perms,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  <Flex>
    <SLAToolbar location={location} onCreate={create} perms={perms} />
    <Box top noPadding>
      <SLATable
        sortData={sortData}
        collection={collection}
        onSortChange={onSortChange}
        perms={perms}
      />
    </Box>
  </Flex>
);

const filterSearch: Function = (search: string): Function => (
  slas: Array<Object>
): Array<Object> => findBy(['name', 'description', 'type'], search, slas);

const collectionSelector: Function = createSelector(
  [querySelector('search'), resourceSelector('slas')],
  (search: string, slas: Object): Array<Object> =>
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    filterSearch(search)(slas.data)
);

const viewSelector: Function = createSelector(
  [
    resourceSelector('slas'),
    resourceSelector('currentUser'),
    collectionSelector,
  ],
  (slas, user, collection): Object => ({
    meta: slas,
    perms: user.data.permissions,
    collection,
  })
);

export default compose(
  connect(
    viewSelector,
    {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'slas' does not exist on type '{}'.
      load: actions.slas.fetch,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'slas' does not exist on type '{}'.
      unsync: actions.slas.unsync,
    }
  ),
  withSort('slas', 'collection', sortDefaults.slas),
  sync('meta'),
  pure(['collection', 'location', 'sortData']),
  titleManager('SLAs'),
  unsync()
)(Slas);
