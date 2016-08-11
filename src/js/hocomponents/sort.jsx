/* @flow */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import wrapDisplayName from 'recompose/wrapDisplayName';

import { sort } from '../store/ui/actions';
import { sortTable } from '../helpers/table';

export default (
  tableName: string,
  collectionProp: string,
  defaultSortData:? Object
) => (
  Component: ReactClass<*>
) => {
  class WrappedComponent extends React.Component {
    props: {
      changeSort: Function,
      sortData: Object
    }

    onSortChange = ({ sortBy }: { sortBy: string }) => {
      const { changeSort, sortData } = this.props;
      if (!sortData || sortData.sortBy !== sortBy) {
        changeSort(tableName, sortBy, 1);
      } else {
        const { sortByKey: { direction, ignoreCase } } = sortData;

        changeSort(tableName, sortBy, -1 * direction, ignoreCase);
      }
    }

    render() {
      const { sortData } = this.props;
      let collection = this.props[collectionProp];

      if (sortData) {
        collection = sortTable(this.props[collectionProp], sortData);
      }

      const newProps = { ...this.props };
      newProps[collectionProp] = collection;

      return <Component {...newProps} onSortChange={this.onSortChange} />;
    }
  }
  WrappedComponent.propTypes = {
    changeSort: PropTypes.func,
    sortData: PropTypes.object,
    [collectionProp]: PropTypes.array,
  };

  const displayName = wrapDisplayName(Component, 'sort');
  WrappedComponent.displayName = displayName;

  WrappedComponent = connect(
    state => ({
      sortData: state.ui.sort[tableName] || defaultSortData,
    }),
    { changeSort: sort.changeSort }
  )(WrappedComponent);

  return WrappedComponent;
};
