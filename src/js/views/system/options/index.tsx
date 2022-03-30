// @flow
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module 'redux' or its corresponding ty... Remove this comment to see the full error message
import { compose } from 'redux';
import size from 'lodash/size';

import sync from '../../../hocomponents/sync';
import { sortDefaults } from '../../../constants/sort';
import actions from '../../../store/api/actions';
import { findBy } from '../../../helpers/search';
import sort from '../../../hocomponents/sort';
import loadMore from '../../../hocomponents/loadMore';
import queryControl from '../../../hocomponents/queryControl';
import {
  Table,
  Thead,
  Tbody,
  FixedRow,
  Th,
} from '../../../components/new_table';
import Headbar from '../../../components/Headbar';
import Box from '../../../components/box';
import NoData from '../../../components/nodata';
import LoadMore from '../../../components/LoadMore';
import DataOrEmptyTable from '../../../components/DataOrEmptyTable';
import { Breadcrumbs, Crumb } from '../../../components/breadcrumbs';
import Search from '../../../containers/search';
import { querySelector, resourceSelector } from '../../../selectors';
import OptionRow from './row';
import titleManager from '../../../hocomponents/TitleManager';
import Pull from '../../../components/Pull';
import { NameColumnHeader } from '../../../components/NameColumn';
import Flex from '../../../components/Flex';
import { injectIntl, FormattedMessage } from 'react-intl';

type Props = {
  load: Function,
  collection: Array<Object>,
  params: Object,
  sortData: Object,
  onSortChange: Function,
  user: Object,
  setOption: Function,
  changeSearchQuery: Function,
  searchQuery: Function,
  openModal: Function,
  closeModal: Function,
  canLoadMore?: boolean,
  handleLoadMore: Function,
  handleLoadAll: Function,
};

const OptionsView: Function = ({
  searchQuery,
  changeSearchQuery,
  sortData,
  onSortChange,
  collection,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  <Flex>
    <Headbar>
      <Breadcrumbs>
        <Crumb active> Options </Crumb>
      </Breadcrumbs>
      <Pull right>
        <Search
          defaultValue={searchQuery}
          onSearchUpdate={changeSearchQuery}
          resource="options"
        />
      </Pull>
    </Headbar>
    <Box top noPadding>
      <Table fixed condensed striped>
        <Thead>
          <FixedRow {...{ sortData, onSortChange }}>
            <Th name="status" icon="lock" />
            <NameColumnHeader />
            <Th icon="application">Type</Th>
            <Th className="text" name="default">
              <FormattedMessage id='table.default-value' />
            </Th>
            <Th className="text" name="value">
              <FormattedMessage id='table.current-value' />
            </Th>
            <Th icon="edit" />
          </FixedRow>
        </Thead>
        <DataOrEmptyTable
          condition={!collection || size(collection) === 0}
          cols={6}
        >
          {props => (
            <Tbody {...props}>
              {collection.map(
                // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
                (option: Object, index: number): React.Element<any> => (
                  <OptionRow
                    first={index === 0}
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                    key={option.name}
                    {...option}
                  />
                )
              )}
            </Tbody>
          )}
        </DataOrEmptyTable>
      </Table>
    </Box>
  </Flex>
);

const filterOptions = srch => collection =>
  findBy(
    ['name', 'default', 'expects', 'value', 'description'],
    srch,
    collection
  );

const collectionSelector = createSelector(
  [resourceSelector('systemOptions'), querySelector('search')],
  (options, search) => filterOptions(search)(options.data)
);

const viewSelector = createSelector(
  [resourceSelector('systemOptions'), collectionSelector],
  (options: Object, collection: Array<Object>): Object => ({
    collection,
    options,
  })
);

export default compose(
  connect(
    viewSelector,
    {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'systemOptions' does not exist on type '{... Remove this comment to see the full error message
      load: actions.systemOptions.fetch,
    }
  ),
  sync('options'),
  sort('options', 'collection', sortDefaults.options),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('search'),
  titleManager('Options'),
  injectIntl
)(OptionsView);
