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
import { FormattedMessage } from 'react-intl';

type AuthLabelsContainerProps = {
  service: Object,
  optimisticDispatch: Function,
  authLabelValues: Array<string>,
};

const AuthLabelsDropdown: Function = compose(
  withDispatch(),
  onlyUpdateForKeys(['label', 'id'])
// @ts-expect-error ts-migrate(2339) FIXME: Property 'label' does not exist on type 'Object'.
)(({ label, id, optimisticDispatch, values }: Object) => (
  // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
  <Dropdown>
    // @ts-expect-error ts-migrate(2739) FIXME: Type '{ children: any; small: true; }' is missing ... Remove this comment to see the full error message
    <Control small>{label.value}</Control>
    {values.map((val: string) => (
      <Item
        title={val}
        // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
        action={(event, value) => {
          optimisticDispatch(
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'services' does not exist on type '{}'.
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
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: AuthLabelsContainerProps): React.Element<any> => (
  <Flex>
    <EnhancedTable
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'authLabels' does not exist on type 'Obje... Remove this comment to see the full error message
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
                <FormattedMessage id="table.value" />
              </DescriptionColumnHeader>
            </FixedRow>
          </Thead>
          <DataOrEmptyTable condition={size(collection) === 0} cols={2}>
            {props => (
              <Tbody {...props}>
                {collection.map((label: Object, index: number) => (
                  <Tr first={index === 0} key={index}>
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                    <NameColumn name={label.name} />
                    <Td className="text">
                      <AuthLabelsDropdown
                        label={label}
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
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
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      authLabelValues: state.api.system.data.auth_label_values || [],
    }),
    {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'services' does not exist on type '{}'.
      fetch: actions.services.fetchAuthLabels,
    }
  ),
  withDispatch(),
  lifecycle({
    componentDidMount() {
      if (!this.props.service.authLabels) {
        this.props.fetch(this.props.service.id);
      }
    },
    componentWillReceiveProps(nextProps) {
      if (this.props.service.id !== nextProps.service.id) {
        this.props.fetch(nextProps.service.id);
      }
    },
  }),
  showIfPassed(({ service }) => service.authLabels, <Loader />),
  onlyUpdateForKeys(['authLabels', 'service', 'authLabelValues'])
)(AuthLabelsContainer);
