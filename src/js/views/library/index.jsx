/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { includes } from 'lodash';

import actions from '../../store/api/actions';

import Toolbar from '../../components/toolbar';
import Loader from '../../components/loader';
import Search from '../../components/search';
import LibraryTable from './table';
import SourceCode from '../../components/source_code';

type Props = {
  dispatch: Function,
  functions: Array<Object>,
  classes: Array<Object>,
  constants: Array<Object>,
};

type State = {
  searchValue: string,
  functions: ?Array<Object>,
  classes: ?Array<Object>,
  constants: ?Array<Object>,
  id: ?string | ?number,
  type: ?string,
};

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
  props: Props;
  state: State;

  state = {
    searchValue: '',
    id: (null: ?string | ?number),
    functions: (null: ?Array<Object>),
    classes: (null: ?Array<Object>),
    constants: (null: ?Array<Object>),
    type: (null: ?string),
    height: (0: number),
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

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.classes && nextProps.constants && nextProps.functions) {
      const { functions, classes, constants } = nextProps;

      this.setState({
        functions,
        classes,
        constants,
      });

      this.updateHeight();

      window.addEventListener('resize', () => {
        this.updateHeight();
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () => {
      this.updateHeight();
    });
  }

  updateHeight: Function = (): void => {
    const height = this.getHeight();

    this.setState({
      height,
    });
  };

  getHeight: Function = (): number => {
    const content = document.querySelector('#content-wrapper').clientHeight;
    const toolbar = document.querySelector('#workflows-toolbar').clientHeight;

    return content - (toolbar + 20);
  };

  filterData: Function = (fn: Function): Function =>
    (collection: Array<Object>): Array<Object> => (
    collection.filter(fn)
  );

  handleSearchUpdate: Function = (searchValue: string): void => {
    let state = {
      searchValue,
    };

    if (searchValue !== '') {
      const filter: Function = this.filterData(d => includes(d.name, searchValue));

      state = Object.assign({}, state, {
        functions: filter(this.props.functions) || [],
        classes: filter(this.props.classes) || [],
        constants: filter(this.props.constants) || [],
      });
    } else {
      const { functions, classes, constants } = this.props;

      state = Object.assign({}, state, {
        functions,
        classes,
        constants,
      });
    }

    this.setState(state);
  };

  handleRowClick: Function = (id: string | number, type: string): void => {
    this.setState({
      id,
      type,
    });

    const item: Object = this.props[type].find(d => d.id === id);

    /**
     * Fetch the resource only if it hasnt been fetched yet
     */
    if (!item.body) {
      this.props.dispatch(
        actions[type].fetch({}, id)
      );
    }
  };

  isActive: Function = (id: string | number, type: string): boolean => (
    id === this.state.id && type === this.state.type
  );

  renderTable(): ?React.Element<any> {
    const { functions, classes, constants, height } = this.state;

    if (!functions || !classes || !constants || !height) {
      return <Loader />;
    }

    return (
      <div
        className="col-sm-3 pane-lib__fns"
        style={{ height: `${height}px` }}
      >
        <div className="well well-sm">
          <LibraryTable
            name="Constants"
            collection={this.state.constants}
            onClick={this.handleRowClick}
            active={this.isActive}
          />
          <LibraryTable
            name="Functions"
            collection={this.state.functions}
            onClick={this.handleRowClick}
            active={this.isActive}
          />
          <LibraryTable
            name="Classes"
            collection={this.state.classes}
            onClick={this.handleRowClick}
            active={this.isActive}
          />
        </div>
      </div>
    );
  }

  renderSource(): ?React.Element<SourceCode> {
    if (!this.state.id || !this.state.type) return undefined;

    const { id, type, height } = this.state;
    const item: ?Object = this.props[type].find(d => d.id === id);

    if (!item || !item.body) return <Loader />;

    return (
      <div className="col-sm-9 pane-lib__src">
        <div>
          <h4>
            { item.name }
            {' '}
            <small>{ item.version }</small>
          </h4>
          <SourceCode height={height - 39}>
            { item.body }
          </SourceCode>
        </div>
      </div>
    );
  }

  render(): React.Element<any> {
    return (
      <div className="library-view__wrapper">
        <Toolbar>
          <Search
            pullLeft
            onSearchUpdate={this.handleSearchUpdate}
            defaultValue={this.state.searchValue}
          />
        </Toolbar>
        <div className="row">
          { this.renderTable() }
          { this.renderSource() }
        </div>
      </div>
    );
  }
}
