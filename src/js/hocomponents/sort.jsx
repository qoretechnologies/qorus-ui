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
      initSort: Function,
      sortData: Object
    }

    componentWillMount() {
      if (defaultSortData) {
        const { initSort } = this.props;
        initSort(tableName, defaultSortData);
      }
    }

    handleSortChange = ({ sortBy }: { sortBy: string }) => {
      const { changeSort, sortData } = this.props;
      if (!sortData || sortData.sortBy !== sortBy) {
        const { sortByKey: { direction } } = sortData;
        changeSort(tableName, sortBy, direction);
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
    state => ({
      sortData: state.ui.sort[tableName],
    }),
    sort
  )(WrappedComponent);

  return WrappedComponent;
};
