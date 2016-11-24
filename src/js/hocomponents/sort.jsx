/* @flow */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import wrapDisplayName from 'recompose/wrapDisplayName';

import { sort } from '../store/ui/actions';
import { sortTable } from '../helpers/table';

export default (
  tableName: string | Function,
  collectionProp: string,
  defaultSortData:? Object | Function,
) => (
  Component: ReactClass<*>
) => {
  class WrappedComponent extends React.Component {
    props: {
      changeSort: Function,
      initSort: Function,
      sortData: Object
    };

    componentWillMount() {
      const tbl = typeof tableName === 'function' ? tableName(this.props) : tableName;
      const defaultSort = typeof defaultSortData === 'function' ?
        defaultSortData(this.props) :
        defaultSortData;

      if (defaultSortData) {
        const { initSort } = this.props;
        initSort(tbl, defaultSort);
      }
    }

    handleSortChange = ({ sortBy }: { sortBy: string }) => {
      const { changeSort, sortData } = this.props;
      const tbl = typeof tableName === 'function' ? tableName(this.props) : tableName;

      if (!sortData || sortData.sortBy !== sortBy) {
        const { sortByKey: { direction } } = sortData;
        changeSort(tbl, sortBy, direction);
      } else {
        const { sortByKey: { direction, ignoreCase } } = sortData;

        changeSort(tbl, sortBy, -1 * direction, ignoreCase);
      }
    };

    render() {
      const { sortData } = this.props;
      let collection = this.props[collectionProp];

      if (sortData) {
        collection = sortTable(this.props[collectionProp], sortData);
      }

      const newProps = { ...this.props };
      newProps[collectionProp] = collection;

      return <Component {...newProps} onSortChange={this.handleSortChange} />;
    }
  }

  WrappedComponent.propTypes = {
    changeSort: PropTypes.func,
    initSort: PropTypes.func,
    sortData: PropTypes.object,
    [collectionProp]: PropTypes.array,
  };

  WrappedComponent.displayName = wrapDisplayName(Component, 'sort');

  WrappedComponent = connect(
    (state, props) => ({
      sortData: state.ui.sort[typeof tableName === 'function' ? tableName(props) : tableName],
    }),
    sort
  )(WrappedComponent);

  return WrappedComponent;
};
