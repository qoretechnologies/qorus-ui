// @flow
import React from 'react';
import compose from 'recompose/compose';
import size from 'lodash/size';
import { connect } from 'react-redux';
import lifecycle from 'recompose/lifecycle';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Flex from '../../components/Flex';
import Loader from '../../components/loader';
import actions from '../../store/api/actions';
import showIfPassed from '../../hocomponents/show-if-passed';
import EnhancedTable from '../../components/EnhancedTable';
import {
  Table,
  Thead,
  FixedRow,
  Tbody,
  Tr,
  Th,
  Td,
} from '../../components/new_table';
import Pull from '../../components/Pull';
import Search from '../search';
import LoadMore from '../../components/LoadMore';
import { sortDefaults } from '../../constants/sort';
import NameColumn, { NameColumnHeader } from '../../components/NameColumn';
import { DescriptionColumnHeader } from '../../components/DescriptionColumn';
import DataOrEmptyTable from '../../components/DataOrEmptyTable';
import Dropdown, { Control, Item } from '../../components/dropdown';
import withDispatch from '../../hocomponents/withDispatch';

type AuthLabelsContainerProps = {
  service: Object,
  optimisticDispatch: Function,
  authLabelValues: Array<string>,
};

const AuthLabelsDropdown: Function = compose(
  withDispatch(),
  onlyUpdateForKeys(['label', 'id'])
)(({ label, id, optimisticDispatch, values }: Object) => (
  <Dropdown>
    <Control small>{label.value}</Control>
    {values.map((val: string) => (
      <Item
        title={val}
        action={(event, value) => {
          optimisticDispatch(
            actions.services.updateAuthLabel,
            id,
            label.name,
            value,
            label.value
          );
        }}
      />
    ))}
  </Dropdown>
));

const AuthLabelsContainer: Function = ({
  service,
  optimisticDispatch,
  authLabelValues,
}: AuthLabelsContainerProps): React.Element<any> => (
  <Flex>
    <EnhancedTable
      collection={service.authLabels}
      searchBy={['name', 'value']}
      sortDefault={sortDefaults.authLabels}
      tableId="authLabels"
    >
      {({
        canLoadMore,
        limit,
        collection,
        handleLoadMore,
        handleLoadAll,
        loadMoreCurrent,
        loadMoreTotal,
        handleSearchChange,
        sortData,
        onSortChange,
      }) => (
        <Table striped condensend fixed>
          <Thead>
            <FixedRow className="toolbar-row">
              <Th>
                <Pull right>
                  <LoadMore
                    canLoadMore={canLoadMore}
                    onLoadMore={handleLoadMore}
                    onLoadAll={handleLoadAll}
                    currentCount={loadMoreCurrent}
                    total={loadMoreTotal}
                    limit={limit}
                  />
                  <Search
                    onSearchUpdate={handleSearchChange}
                    resource="authLabels"
                  />
                </Pull>
              </Th>
            </FixedRow>
            <FixedRow {...{ sortData, onSortChange }}>
              <NameColumnHeader />
              <DescriptionColumnHeader name="value">
                Value
              </DescriptionColumnHeader>
            </FixedRow>
          </Thead>
          <DataOrEmptyTable condition={size(collection) === 0} cols={2}>
            {props => (
              <Tbody {...props}>
                {collection.map((label: Object, index: number) => (
                  <Tr first={index === 0} key={index}>
                    <NameColumn name={label.name} />
                    <Td className="text">
                      <AuthLabelsDropdown
                        label={label}
                        id={service.id}
                        values={authLabelValues}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            )}
          </DataOrEmptyTable>
        </Table>
      )}
    </EnhancedTable>
  </Flex>
);

export default compose(
  connect(
    (state: Object): Object => ({
      authLabelValues: state.api.system.data.auth_label_values || [],
    }),
    {
      fetch: actions.services.fetchAuthLabels,
    }
  ),
  withDispatch(),
  lifecycle({
    componentDidMount () {
      if (!this.props.service.authLabels) {
        this.props.fetch(this.props.service.id);
      }
    },
    componentWillReceiveProps (nextProps) {
      if (this.props.service.id !== nextProps.service.id) {
        this.props.fetch(nextProps.service.id);
      }
    },
  }),
  showIfPassed(({ service }) => service.authLabels, <Loader />),
  onlyUpdateForKeys(['authLabels', 'service', 'authLabelValues'])
)(AuthLabelsContainer);
