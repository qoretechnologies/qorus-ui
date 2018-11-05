/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import capitalize from 'lodash/capitalize';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';

import actions from '../../store/api/actions';
import Box from '../../components/box';
import Search from '../../components/search';
import sync from '../../hocomponents/sync';
import Code from '../../components/code';
import queryControl from '../../hocomponents/queryControl';
import { querySelector, resourceSelector } from '../../selectors';
import { findBy } from '../../helpers/search';
import { Breadcrumbs, Crumb } from '../../components/breadcrumbs';
import Toolbar from '../../components/toolbar';
import titleManager from '../../hocomponents/TitleManager';
import Headbar from '../../components/Headbar';
import Pull from '../../components/Pull';

const filterCollection: Function = (
  query: string,
  collection: Array<Object>
): Array<Object> => findBy(['name', 'version'], query, collection);

const functionsSelector = createSelector(
  [resourceSelector('functions'), querySelector('q')],
  (collection, query) => filterCollection(query, collection.data)
);

const classesSelector = createSelector(
  [resourceSelector('classes'), querySelector('q')],
  (collection, query) => filterCollection(query, collection.data)
);

const constantsSelector = createSelector(
  [resourceSelector('constants'), querySelector('q')],
  (collection, query) => filterCollection(query, collection.data)
);

const viewSelector = createSelector(
  [
    resourceSelector('functions'),
    functionsSelector,
    resourceSelector('classes'),
    classesSelector,
    resourceSelector('constants'),
    constantsSelector,
  ],
  (
    metaFunctions,
    functions,
    metaClasses,
    classes,
    metaConstants,
    constants
  ): Object => ({
    metaFunctions,
    functions,
    metaClasses,
    classes,
    metaConstants,
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
  qQuery: string,
  changeQQuery: Function,
  location: Object,
  handleHeight: Function,
  handleRowClick: Function,
};

const LibraryView: Function = ({
  changeQQuery,
  qQuery,
  handleHeight,
  handleRowClick,
  location,
  functions,
  classes,
  constants,
}: Props): React.Element<any> => (
  <div>
    <Headbar>
      <Breadcrumbs>
        <Crumb active>Library</Crumb>
      </Breadcrumbs>
      <Pull right>
        <Search onSearchUpdate={changeQQuery} defaultValue={qQuery} />
      </Pull>
    </Headbar>
    <Box top>
      <Code
        data={{
          functions,
          classes,
          constants,
        }}
        heightUpdater={handleHeight}
        onItemClick={handleRowClick}
        location={location}
      />
    </Box>
  </div>
);

export default compose(
  connect(
    viewSelector,
    {
      fetchFunctions: actions.functions.fetch,
      fetchClasses: actions.classes.fetch,
      fetchConstants: actions.constants.fetch,
    }
  ),
  sync('metaFunctions', true, 'fetchFunctions'),
  sync('metaClasses', true, 'fetchClasses'),
  sync('metaConstants', true, 'fetchConstants'),
  queryControl('q'),
  withHandlers({
    handleHeight: (): Function => (): number => {
      const { top } = document
        .querySelector('.code-list')
        .getBoundingClientRect();

      return window.innerHeight - top - 60;
    },
    handleRowClick: (props: Props): Function => (
      name: string,
      body: string,
      type: string,
      id: number
    ): void => {
      const item: Object = props[type.toLowerCase()].find(d => d.id === id);

      if (!item.body) {
        props[`fetch${capitalize(type)}`]({}, id);
      }
    },
  }),
  titleManager('Library'),
  pure(['functions', 'classes', 'constants', 'qQuery', 'location'])
)(LibraryView);
