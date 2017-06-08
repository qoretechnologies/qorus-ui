// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import lifecycle from 'recompose/lifecycle';
import pure from 'recompose/onlyUpdateForKeys';
import moment from 'moment';

import sync from '../../../hocomponents/sync';
import patch from '../../../hocomponents/patchFuncArgs';
import loadMore from '../../../hocomponents/loadMore';
import unsync from '../../../hocomponents/unsync';
import actions from '../../../store/api/actions';
import { resourceSelector, querySelector } from '../../../selectors';
import Tree from '../../../components/tree';
import Container from '../../../components/container';
import ReleasesToolbar from './toolbar';
import { Control as Button } from '../../../components/controls';
import { sortTable } from '../../../helpers/table';

type Props = {
  data: Object,
  fileName: ?string,
  component: ?string,
  maxdate: ?string,
  mindate: ?string,
  canLoadMore: boolean,
  handleLoadMore: Function,
  offset: number,
  limit: number,
  sort: string,
  sortDir: boolean,
  compact: boolean,
};

const Releases: Function = ({
  data,
  canLoadMore,
  handleLoadMore,
  sort,
  sortDir,
  compact,
}: Props): React.Element<any> => (
  <div className="tab-pane active">
    <ReleasesToolbar
      sort={sort}
      sortDir={sortDir}
      compact={compact}
    />
    <Container marginBottom={30}>
      <Tree data={data} />
    </Container>
    {canLoadMore && (
      <Button
        big
        label="Load more..."
        btnStyle="success"
        onClick={handleLoadMore}
      />
    )}
  </div>
);

const formatReleases: Function = (): Function => (data: Array<Object>): Object => {
  if (!data.length) return {};

  const res: Object = data.reduce((newData: Object, current: Object): Object => {
    const copy: Object = { ...current };
    let files: ?Object = null;

    if (copy.files && copy.files.length) {
      files = copy.files.reduce((newFiles: Object, curFile: Object): Object => {
        const fileCopy: Object = { ...curFile };
        let components: ?Object = null;

        if (fileCopy.components && fileCopy.components.length) {
          components = fileCopy.components.reduce((newComps: Object, curComp: Object): Object => {
            const compCopy: Object = { ...curComp };

            const createdComp: string = moment(compCopy.created).format('YYYY-MM-DD HH:mm:ss');
            const updatedComp: string = moment(compCopy.updated).format('YYYY-MM-DD HH:mm:ss');

            return {
              ...newComps,
              ...{
                [`${compCopy.component} v${compCopy.version} (${compCopy.id})`]: {
                  Timestamps: `Created: ${createdComp} Updated: ${updatedComp}`,
                  Info: `${compCopy.hash_type} - ${compCopy.hash}`,
                },
              },
            };
          }, {});
        }

        const createdFile: string = moment(fileCopy.created).format('YYYY-MM-DD HH:mm:ss');
        const updatedFile: string = moment(fileCopy.updated).format('YYYY-MM-DD HH:mm:ss');

        return {
          ...newFiles,
          ...{
            [fileCopy.name]: {
              Timestamps: `Created: ${createdFile} Updated: ${updatedFile}`,
              Info: `${fileCopy.type} - ${fileCopy.hash_type} - ${fileCopy.hash}`,
              ...components,
            },
          },
        };
      }, {});
    }

    const created: string = moment(copy.created).format('YYYY-MM-DD HH:mm:ss');
    const updated: string = moment(copy.updated).format('YYYY-MM-DD HH:mm:ss');

    return {
      ...newData,
      ...{
        [`[${created}] ${copy.name}`]: {
          Timestamps: `Created: ${created} Updated: ${updated}`,
          ...files,
        },
      },
    };
  }, {});

  return res;
};

const sortReleases: Function = (
  sort: string,
  sortDir: string
): Function => (data: Array<Object>): Array<Object> => (
  data.length ?
    sortTable(data, {
      sortBy: sort === 'Date' ? 'created' : sort.toLowerCase(),
      sortByKey: {
        direction: sortDir === 'Ascending' ? 1 : -1,
        ignoreCase: true,
      },
    }) :
    []
);

const releaseSelector: Function = createSelector(
  [
    resourceSelector('releases'),
  ], (releases: Object) => compose(
    formatReleases(),
    sortReleases(releases.sort, releases.sortDir),
  )(releases.data)
);

const componentSelector = (state: Object, {
  compact,
  location,
  component,
}: Object): string => (
  compact ? component : location.query.component
);

const viewSelector: Function = createSelector(
  [
    resourceSelector('releases'),
    releaseSelector,
    querySelector('fileName'),
    componentSelector,
    querySelector('maxdate'),
    querySelector('mindate'),
  ],
  (
    releases: Object,
    data: Object,
    fileName: ?string,
    component: ?string,
    maxdate: ?string,
    mindate: ?string,
  ): Object => ({
    meta: releases,
    data,
    fileName,
    component,
    maxdate,
    mindate,
    sort: releases.sort,
    sortDir: releases.sortDir,
  })
);

export default compose(
  connect(
    viewSelector,
    {
      load: actions.releases.fetchReleases,
      fetch: actions.releases.fetchReleases,
      unsync: actions.releases.unsync,
    }
  ),
  loadMore('data', 'releases'),
  patch('load', [
    'fileName',
    'component',
    'maxdate',
    'mindate',
    'limit',
    'offset',
    false,
  ]),
  sync('meta'),
  lifecycle({
    componentWillReceiveProps(nextProps: Props) {
      const {
        fileName,
        component,
        maxdate,
        mindate,
        offset,
        fetch,
        changeOffset,
      } = this.props;

      if ((mindate !== nextProps.mindate || maxdate !== nextProps.maxdate ||
      fileName !== nextProps.fileName || component !== nextProps.component)
      && nextProps.offset !== 0) {
        changeOffset(0);
      } else if (
        fileName !== nextProps.fileName ||
        component !== nextProps.component ||
        maxdate !== nextProps.maxdate ||
        mindate !== nextProps.mindate ||
        offset !== nextProps.offset
      ) {
        fetch(
          nextProps.fileName,
          nextProps.component,
          nextProps.maxdate,
          nextProps.mindate,
          nextProps.limit,
          nextProps.offset,
          nextProps.offset !== 0,
        );
      }
    },
  }),
  unsync(),
  pure([
    'data',
    'fileName',
    'component',
    'minDate',
    'maxDate',
    'limit',
    'offset',
    'canLoadMore',
    'sort',
    'sortDir',
  ])
)(Releases);
