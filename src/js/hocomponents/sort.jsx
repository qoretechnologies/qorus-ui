/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import wrapDisplayName from 'recompose/wrapDisplayName';

import { sort } from '../store/ui/actions';
import { sortTable } from '../helpers/table';
import { functionOrStringExp } from '../helpers/functions';
import { sortKeys } from '../constants/sort';

type Props = {
  changeSort: Function,
  initSort: Function,
  sortData: Object,
  storage: Object,
};

export default (
  tableName: string | Function,
  collectionProp: string,
  defaultSortData: ?Object | Function
) => (Component: ReactClass<*>) => {
  class WrappedComponent extends React.Component {
    props: Props = this.props;

    componentWillMount() {
      const tbl =
        typeof tableName === 'function' ? tableName(this.props) : tableName;

      this.setupSorting(tbl, this.props);
    }

    componentWillReceiveProps(nextProps: Props) {
      const tbl =
        typeof tableName === 'function' ? tableName(this.props) : tableName;
      const nextTbl =
        typeof tableName === 'function' ? tableName(nextProps) : tableName;

      if (tbl !== nextTbl) {
        this.setupSorting(nextTbl, nextProps);
      }
    }

    setupSorting = (table: string, props: Props) => {
      const { initSort } = props;
      const defaultSort = this.getDefaultSortData(table, props);
      initSort(table, defaultSort);
    };

    getDefaultSortData = (table, props) => {
      let defaultSort;

      if (!props.storage[table] || !props.storage[table].sort) {
        defaultSort =
          typeof defaultSortData === 'function'
            ? defaultSortData(props)
            : defaultSortData;
      } else {
        defaultSort = props.storage[table].sort;
      }

      return defaultSort;
    };

    handleSortChange = ({ sortBy }: { sortBy: string }) => {
      const { changeSort, sortData } = this.props;
      const tbl =
        typeof tableName === 'function' ? tableName(this.props) : tableName;

      if (!sortData || sortData.sortBy !== sortBy) {
        const {
          sortByKey: { direction },
        } = sortData;
        changeSort(tbl, sortBy, direction);
      } else {
        const {
          sortByKey: { direction, ignoreCase },
        } = sortData;

        changeSort(tbl, sortBy, -1 * direction, ignoreCase);
      }
    };

    render() {
      const collectionPropSelected = functionOrStringExp(
        collectionProp,
        this.props
      );
      const tableSelected = functionOrStringExp(tableName, this.props);
      const fallbackSortData = this.getDefaultSortData(
        tableSelected,
        this.props
      );
      let sortData = this.props.sortData || fallbackSortData;
      let collection = this.props[collectionPropSelected];
      const newProps = { ...this.props, sortData: sortData };
      const sortKeysObj = sortKeys[tableSelected] || {};

      if (sortData && collection) {
        collection = sortTable(this.props[collectionPropSelected], sortData);
        newProps[collectionPropSelected] = collection;
      }

      return (
        <Component
          {...newProps}
          sortKeysObj={sortKeysObj}
          onSortChange={this.handleSortChange}
        />
      );
    }
  }

  WrappedComponent.displayName = wrapDisplayName(Component, 'sort');

  WrappedComponent = connect(
    (state, props) => ({
      sortData:
        state.ui.sort[
          typeof tableName === 'function' ? tableName(props) : tableName
        ],
      storage: state.api.currentUser.data.storage || {},
    }),
    sort
  )(WrappedComponent);

  return WrappedComponent;
};
