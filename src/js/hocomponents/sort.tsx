/* @flow */
import reduce from 'lodash/reduce';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import wrapDisplayName from 'recompose/wrapDisplayName';
import { sortKeys } from '../constants/sort';
import { functionOrStringExp } from '../helpers/functions';
import { sortTable } from '../helpers/table';
import { sort } from '../store/ui/actions';

type Props = {
  changeSort: Function;
  initSort: Function;
  sortData: any;
  storage: any;
};

export default (
    tableName: string | Function,
    collectionProp: string,
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    defaultSortData: any | Function
    // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'ReactClass'.
  ) =>
  (Component) => {
    @injectIntl
    class WrappedComponent extends React.Component {
      props: Props = this.props;

      componentWillMount() {
        const tbl = typeof tableName === 'function' ? tableName(this.props) : tableName;

        this.setupSorting(tbl, this.props);
      }

      componentWillReceiveProps(nextProps: Props) {
        const tbl = typeof tableName === 'function' ? tableName(this.props) : tableName;
        const nextTbl = typeof tableName === 'function' ? tableName(nextProps) : tableName;

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
            typeof defaultSortData === 'function' ? defaultSortData(props) : defaultSortData;
        } else {
          defaultSort = props.storage[table].sort;
        }

        return defaultSort;
      };

      handleSortChange = ({ sortBy }: { sortBy: string }) => {
        const { changeSort, sortData } = this.props;
        const tbl = typeof tableName === 'function' ? tableName(this.props) : tableName;

        // @ts-ignore ts-migrate(2339) FIXME: Property 'sortBy' does not exist on type 'Object'.
        if (!sortData || sortData.sortBy !== sortBy) {
          const {
            // @ts-ignore ts-migrate(2339) FIXME: Property 'sortByKey' does not exist on type 'Objec... Remove this comment to see the full error message
            sortByKey: { direction },
          } = sortData;
          changeSort(tbl, sortBy, direction);
        } else {
          const {
            // @ts-ignore ts-migrate(2339) FIXME: Property 'sortByKey' does not exist on type 'Objec... Remove this comment to see the full error message
            sortByKey: { direction, ignoreCase },
          } = sortData;

          changeSort(tbl, sortBy, -1 * direction, ignoreCase);
        }
      };

      render() {
        const collectionPropSelected = functionOrStringExp(collectionProp, this.props);
        const tableSelected = functionOrStringExp(tableName, this.props);
        const fallbackSortData = this.getDefaultSortData(tableSelected, this.props);
        let sortData = this.props.sortData || fallbackSortData;
        let collection = this.props[collectionPropSelected];
        const newProps = { ...this.props, sortData: sortData };
        let sortKeysObj = sortKeys[tableSelected] || {};
        sortKeysObj = reduce(
          sortKeysObj,
          (newSortKeys, column, key) => {
            return {
              ...newSortKeys,
              // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
              [this.props.intl.formatMessage({ id: column })]: column,
            };
          },
          {}
        );

        if (sortData && collection) {
          collection = sortTable(this.props[collectionPropSelected], sortData);
          newProps[collectionPropSelected] = collection;
        }

        return (
          <Component {...newProps} sortKeysObj={sortKeysObj} onSortChange={this.handleSortChange} />
        );
      }
    }

    // @ts-ignore ts-migrate(2339) FIXME: Property 'displayName' does not exist on type 'typ... Remove this comment to see the full error message
    WrappedComponent.displayName = wrapDisplayName(Component, 'sort');

    // @ts-ignore ts-migrate(2539) FIXME: Cannot assign to 'WrappedComponent' because it is ... Remove this comment to see the full error message
    WrappedComponent = connect(
      (state, props) => ({
        sortData: state.ui.sort[typeof tableName === 'function' ? tableName(props) : tableName],
        storage: state.api.currentUser.data.storage || {},
      }),
      sort
    )(WrappedComponent);

    return WrappedComponent;
  };
