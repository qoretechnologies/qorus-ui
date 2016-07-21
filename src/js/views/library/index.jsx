/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import actions from '../../store/api/actions';

import Toolbar from '../../components/toolbar';
import Loader from '../../components/loader';
import Search from '../../components/search';
import LibraryTable from './table';

const functionsSelector = state => state.api.functions.data;
const classesSelector = state => state.api.classes.data;
const constantsSelector = state => state.api.constants.data;

const viewSelector = createSelector(
  [
    functionsSelector,
    classesSelector,
    constantsSelector,
  ], (f, c, cons) => ({
    functions: f,
    classes: c,
    constants: cons,
  })
);

@connect(viewSelector)
export default class LibraryView extends Component {
  props: {
    dispatch: Function,
    functions: Array<Object>,
    classes: Array<Object>,
    constants: Array<Object>,
  };

  state: {
    value: string,
    functions: Array<Object>,
    classes: Array<Object>,
    constants: Array<Object>,
  };

  state = {
    searchValue: '',
    functions: this.props.functions,
    classes: this.props.classes,
    constants: this.props.constants,
  };

  componentWillMount() {
    this.props.dispatch(
      actions.functions.fetch()
    );
    this.props.dispatch(
      actions.classes.fetch()
    );
    this.props.dispatch(
      actions.constants.fetch()
    );
  }

  handleSearchUpdate: Function = (searchValue: string): void => {
    this.setState({
      searchValue,
    });
  };

  handleRowClick: Function = (id: string | number): void => {
    console.log(id);
  };

  render(): React.Element<any> {
    const { functions, classes, constants } = this.props;

    if (!functions || !classes || !constants) {
      return <Loader />;
    }

    return (
      <div className="library-view__wrapper">
        <Toolbar>
          <Search
            pullLeft
            onSearchUpdate={this.handleSearchUpdate}
            defaultValue={this.state.searchValue}
          />
        </Toolbar>
        <div className="row pane-lib">
          <div className="col-sm-3 pane-lib__fns">
            <div className="well well-sm">
              <LibraryTable
                name="Constants"
                collection={this.state.constants}
                onClick={this.handleRowClick}
              />
              <LibraryTable
                name="Functions"
                collection={this.state.functions}
                onClick={this.handleRowClick}
              />
              <LibraryTable
                name="Classes"
                collection={this.state.classes}
                onClick={this.handleRowClick}
              />
            </div>
          </div>
          <div className="library-source"></div>
        </div>
      </div>
    );
  }
}
