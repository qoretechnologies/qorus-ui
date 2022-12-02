// @flow
import size from 'lodash/size';
import { useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
// @ts-ignore ts-migrate(2307) FIXME: Cannot find module 'redux' or its corresponding ty... Remove this comment to see the full error message
import { compose } from 'redux';
import { createSelector } from 'reselect';
import Box from '../../../components/box';
import { Breadcrumbs, Crumb } from '../../../components/breadcrumbs';
import DataOrEmptyTable from '../../../components/DataOrEmptyTable';
import Flex from '../../../components/Flex';
import Headbar from '../../../components/Headbar';
import { NameColumnHeader } from '../../../components/NameColumn';
import { FixedRow, Table, Tbody, Th, Thead } from '../../../components/new_table';
import Pull from '../../../components/Pull';
import { sortDefaults } from '../../../constants/sort';
import Search from '../../../containers/search';
import { findBy } from '../../../helpers/search';
import queryControl from '../../../hocomponents/queryControl';
import sort from '../../../hocomponents/sort';
import sync from '../../../hocomponents/sync';
import titleManager from '../../../hocomponents/TitleManager';
import { querySelector, resourceSelector } from '../../../selectors';
import actions from '../../../store/api/actions';
import OptionModal from './modal';
import OptionRow from './row';

type Props = {
  load: Function;
  collection: Array<Object>;
  params: any;
  sortData: any;
  onSortChange: Function;
  user: any;
  setOption: Function;
  changeSearchQuery: Function;
  searchQuery: Function;
  openModal: Function;
  closeModal: Function;
  canLoadMore?: boolean;
  handleLoadMore: Function;
  handleLoadAll: Function;
};

const OptionsView: Function = ({
  searchQuery,
  changeSearchQuery,
  sortData,
  onSortChange,
  collection,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => {
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <Flex>
      {selectedOption && (
        <OptionModal onClose={() => setSelectedOption(null)} model={selectedOption} />
      )}
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
        <Table fixed condensed striped id="options-view">
          <Thead>
            <FixedRow {...{ sortData, onSortChange }}>
              <Th name="status" icon="lock" />
              <NameColumnHeader />
              <Th icon="application">Type</Th>
              <Th className="text" name="default">
                <FormattedMessage id="table.default-value" />
              </Th>
              <Th className="text" name="value">
                <FormattedMessage id="table.current-value" />
              </Th>
              <Th icon="edit" />
            </FixedRow>
          </Thead>
          <DataOrEmptyTable condition={!collection || size(collection) === 0} cols={6}>
            {(props) => (
              <Tbody {...props}>
                {collection.map(
                  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
                  (option: any, index: number) => (
                    <OptionRow
                      first={index === 0}
                      // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                      key={option.name}
                      onEditClick={() => setSelectedOption(option)}
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
};

const filterOptions = (srch) => (collection) =>
  findBy(['name', 'default', 'expects', 'value', 'description'], srch, collection);

const collectionSelector = createSelector(
  [resourceSelector('systemOptions'), querySelector('search')],
  (options, search) => filterOptions(search)(options.data)
);

const viewSelector = createSelector(
  [resourceSelector('systemOptions'), collectionSelector],
  (options: any, collection: Array<Object>): any => ({
    collection,
    options,
  })
);

export default compose(
  connect(viewSelector, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'systemOptions' does not exist on type '{... Remove this comment to see the full error message
    load: actions.systemOptions.fetch,
  }),
  sync('options'),
  sort('options', 'collection', sortDefaults.options),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('search'),
  titleManager('Options'),
  injectIntl
)(OptionsView);
