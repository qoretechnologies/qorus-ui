/* @flow */
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import capitalize from 'lodash/capitalize';

import actions from '../../store/api/actions';
import Toolbar from '../../components/toolbar';
import Loader from '../../components/loader';
import Search from '../../components/search';
import CodeSection from '../../components/code/section';
import SourceCode from '../../components/source_code';
import InfoTable from '../../components/info_table';
import search from '../../hocomponents/search';
import { querySelector, resourceSelector } from '../../selectors';
import { findBy } from '../../helpers/search';

type State = {
  searchValue: string,
  functions: ?Array<Object>,
  classes: ?Array<Object>,
  constants: ?Array<Object>,
  id: ?string | ?number,
  type: ?string,
};

const filterCollection: Function = (query: string, collection: Array<Object>): Array<Object> => (
  findBy(['name', 'version'], query, collection)
);

const functionsSelector = createSelector(
  [
    resourceSelector('functions'),
    querySelector('q'),
  ], (collection, query) => filterCollection(query, collection.data)
);

const classesSelector = createSelector(
  [
    resourceSelector('classes'),
    querySelector('q'),
  ], (collection, query) => filterCollection(query, collection.data)
);

const constantsSelector = createSelector(
  [
    resourceSelector('constants'),
    querySelector('q'),
  ], (collection, query) => filterCollection(query, collection.data)
);

const viewSelector = createSelector(
  [
    functionsSelector,
    classesSelector,
    constantsSelector,
  ], (functions, classes, constants): Object => ({
    functions,
    classes,
    constants,
  })
);

type Props = {
  dispatch: Function,
  functions: Array<Object>,
  fetchFunctions: Function,
  classes: Array<Object>,
  fetchClasses: Function,
  constants: Array<Object>,
  fetchConstants: Function,
  query: string,
  onSearchChange: Function,
};

@compose(
  connect(
    viewSelector,
    {
      fetchFunctions: actions.functions.fetch,
      fetchClasses: actions.classes.fetch,
      fetchConstants: actions.constants.fetch,
    }
  ),
  search(),
)
export default class LibraryView extends Component {
  props: Props;
  state: State;

  state = {
    selected: (null: ?Object),
    height: (0: number),
  };

  componentWillMount() {
    this.props.fetchFunctions();
    this.props.fetchClasses();
    this.props.fetchConstants();

    window.addEventListener('resize', () => {
      this.updateHeight();
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    const { functions, classes, constants, query } = nextProps;

    if (functions && classes && constants) {
      this.updateHeight();
    }

    if (this.props.query !== query) {
      this.setState({
        selected: null,
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

  handleRowClick: Function = (
    name: string,
    body: string,
    type: string,
    id: number
  ): void => {
    this.setState({
      selected: {
        name,
        body,
        id,
        type,
      },
    });

    const item: Object = this.props[type.toLowerCase()].find(d => d.id === id);

    if (!item.body) {
      this.props[`fetch${type}`]({}, id);
    }
  };

  renderTable(): ?React.Element<any> {
    const { functions, classes, constants } = this.props;

    if (!functions || !classes || !constants) {
      return <Loader />;
    }

    return (
      <div className="code-list" style={{ height: `${this.state.height}px` }}>
        <CodeSection
          name="Constants"
          items={this.props.constants}
          onItemClick={this.handleRowClick}
          selected={this.state.selected}
        />
        <CodeSection
          name="Functions"
          items={this.props.functions}
          onItemClick={this.handleRowClick}
          selected={this.state.selected}
        />
        <CodeSection
          name="Classes"
          items={this.props.classes}
          onItemClick={this.handleRowClick}
          selected={this.state.selected}
        />
      </div>
    );
  }

  renderSource(): ?React.Element<SourceCode> {
    if (!this.state.selected) return undefined;

    const { selected: { id, type, name }, height } = this.state;
    const item: ?Object = this.props[type.toLowerCase()].find(d => d.id === id);

    if (!item || !item.body) return <Loader />;

    return (
      <div className="code-source">
        <div>
          <h5>
            {`${capitalize(name)}
            ${item.version ? `v${item.version}` : ''}
            ${item.id ? `(${item.id})` : ''}`}
          </h5>
          <InfoTable
            object={item}
            pick={
              item.tags && Object.keys(item.tags).length ?
              ['author', 'offset', 'source', 'description', 'tags'] :
              ['author', 'offset', 'source', 'description']
            }
          />
          <SourceCode height={height - 35}>
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
            onSearchUpdate={this.props.onSearchChange}
            defaultValue={this.props.query}
          />
        </Toolbar>
        <div className="code">
          { this.renderTable() }
          { this.renderSource() }
        </div>
      </div>
    );
  }
}
