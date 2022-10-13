// @flow
import size from 'lodash/size';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import DataOrEmptyTable from '../../components/DataOrEmptyTable';
import { DescriptionColumnHeader } from '../../components/DescriptionColumn';
import Dropdown, { Control, Item } from '../../components/dropdown';
import EnhancedTable from '../../components/EnhancedTable';
import Flex from '../../components/Flex';
import Loader from '../../components/loader';
import LoadMore from '../../components/LoadMore';
import NameColumn, { NameColumnHeader } from '../../components/NameColumn';
import { FixedRow, Table, Tbody, Td, Th, Thead, Tr } from '../../components/new_table';
import Pull from '../../components/Pull';
import { sortDefaults } from '../../constants/sort';
import showIfPassed from '../../hocomponents/show-if-passed';
import withDispatch from '../../hocomponents/withDispatch';
import actions from '../../store/api/actions';
import Search from '../search';

type AuthLabelsContainerProps = {
  service: any;
  optimisticDispatch: Function;
  authLabelValues: Array<string>;
};

const AuthLabelsDropdown: Function = compose(
  withDispatch(),
  onlyUpdateForKeys(['label', 'id'])
  // @ts-ignore ts-migrate(2339) FIXME: Property 'label' does not exist on type 'Object'.
)(({ label, id, optimisticDispatch, values }: any) => (
  // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
  <Dropdown>
    {/* @ts-ignore ts-migrate(2739) FIXME: Type '{ children: any; small: true; }' is missing ... Remove this comment to see the full error message */}
    <Control small>{label.value}</Control>
    {values.map((val: string) => (
      <Item
        title={val}
        // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
        action={(event, value) => {
          optimisticDispatch(
            // @ts-ignore ts-migrate(2339) FIXME: Property 'services' does not exist on type '{}'.
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
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
AuthLabelsContainerProps) => (
  <Flex>
    <EnhancedTable
      // @ts-ignore ts-migrate(2339) FIXME: Property 'authLabels' does not exist on type 'Obje... Remove this comment to see the full error message
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
        <Table striped condensed fixed id="authlabels-view">
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
                  <Search onSearchUpdate={handleSearchChange} resource="authLabels" />
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
            {(props) => (
              <Tbody {...props}>
                {collection.map((label: any, index: number) => (
                  <Tr first={index === 0} key={index}>
                    {/* @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'. */}
                    <NameColumn name={label.name} />
                    <Td className="text">
                      <AuthLabelsDropdown
                        label={label}
                        // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
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
    (state: any): any => ({
      // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      authLabelValues: state.api.system.data.auth_label_values || [],
    }),
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'services' does not exist on type '{}'.
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
