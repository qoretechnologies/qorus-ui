/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';

import PermsRow from './row';
import {
  Table,
  Tbody,
  Thead,
  FixedRow,
  Th,
} from '../../../../components/new_table';
import sort from '../../../../hocomponents/sort';
import check from '../../../../hocomponents/check-no-data';
import { sortDefaults } from '../../../../constants/sort';
import Pull from '../../../../components/Pull';
import LoadMore from '../../../../components/LoadMore';
import { NameColumnHeader } from '../../../../components/NameColumn';
import { DescriptionColumnHeader } from '../../../../components/DescriptionColumn';
import { ActionColumnHeader } from '../../../../components/ActionColumn';
import { Control as Button } from '../../../../components/controls';
import loadMore from '../../../../hocomponents/loadMore';

type Props = {
  collection: Array<Object>,
  onEditClick: Function,
  onDeleteClick: Function,
  canEdit: boolean,
  canDelete: boolean,
  onSortChange: Function,
  sortData: Object,
  canAdd: boolean,
  onAddPermClick: Function,
  canLoadMore: boolean,
  handleLoadAll: Function,
  handleLoadMore: Function,
  limit: number,
};

const PermsTable: Function = ({
  collection,
  onSortChange,
  sortData,
  canAdd,
  onAddPermClick,
  canLoadMore,
  handleLoadAll,
  handleLoadMore,
  limit,
  ...rest
}: Props): React.Element<Table> => (
  <Table striped condensed fixed>
    <Thead>
      <FixedRow className="toolbar-row">
        <Th colspan="full">
          <Pull>
            <Button
              disabled={!canAdd}
              iconName="plus"
              text="Add permission"
              onClick={onAddPermClick}
              big
            />
          </Pull>
          <Pull right>
            <LoadMore
              canLoadMore={canLoadMore}
              onLoadMore={handleLoadMore}
              onLoadAll={handleLoadAll}
              limit={limit}
            />
          </Pull>
        </Th>
      </FixedRow>
      <FixedRow {...{ onSortChange, sortData }}>
        <NameColumnHeader />
        <Th className="text normal" name="permission_type" icon="info-sign">
          Type
        </Th>
        <DescriptionColumnHeader />
        <ActionColumnHeader />
      </FixedRow>
    </Thead>
    <Tbody>
      {collection.map(
        (role: Object, index: number): React.Element<PermsRow> => (
          <PermsRow first={index === 0} key={index} model={role} {...rest} />
        )
      )}
    </Tbody>
  </Table>
);

export default compose(
  check(({ collection }): boolean => collection && collection.length),
  loadMore('collection', null, true, 50),
  sort('rbacperms', 'collection', sortDefaults.rbacPerms),
  pure(['sortData', 'collection'])
)(PermsTable);
