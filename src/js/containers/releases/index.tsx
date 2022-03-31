// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import lifecycle from 'recompose/lifecycle';
import pure from 'recompose/onlyUpdateForKeys';
import moment from 'moment';
import { Button, Intent } from '@blueprintjs/core';

import sync from '../../hocomponents/sync';
import patch from '../../hocomponents/patchFuncArgs';
import loadMore from '../../hocomponents/loadMore';
import unsync from '../../hocomponents/unsync';
import actions from '../../store/api/actions';
import { resourceSelector, querySelector } from '../../selectors';
import Tree from '../../components/tree';
import Box from '../../components/box';
import ReleasesToolbar from './toolbar';
import { sortTable } from '../../helpers/table';
import Headbar from '../../components/Headbar';
import { Breadcrumbs, Crumb } from '../../components/breadcrumbs';
import Flex from '../../components/Flex';

type Props = {
  data: Object,
  // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  fileName: ?string,
  // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  component: ?string,
  // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  maxdate: ?string,
  // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
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
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  <Flex>
    {!compact && (
      <Headbar>
        <Breadcrumbs>
          <Crumb active>Releases</Crumb>
        </Breadcrumbs>
      </Headbar>
    )}
    {compact ? (
      [
        <ReleasesToolbar
          sort={sort}
          sortDir={sortDir}
          compact
          key="release-toolbar"
        />,
        <Flex key="release-content">
          { /* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */ }
          <Tree data={data} />
        </Flex>,
      ]
    ) : (
      <Box top>
        <ReleasesToolbar sort={sort} sortDir={sortDir} />
        <Flex>
          { /* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */ }
          <Tree data={data} />
        </Flex>
      </Box>
    )}
    {canLoadMore && (
      <Button
        text="Load more..."
        intent={Intent.PRIMARY}
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type '((event... Remove this comment to see the full error message
        onClick={handleLoadMore}
      />
    )}
  </Flex>
);

const formatReleases: Function = (): Function => (
  data: Array<Object>
): Object => {
  if (!data.length) return {};

  const res: Object = data.reduce(
    (newData: Object, current: Object): Object => {
      const copy: Object = { ...current };
      // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
      let files: ?Object = null;

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'files' does not exist on type 'Object'.
      if (copy.files && copy.files.length) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'files' does not exist on type 'Object'.
        files = copy.files.reduce(
          (newFiles: Object, curFile: Object): Object => {
            const fileCopy: Object = { ...curFile };
            // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
            let components: ?Object = null;

            // @ts-expect-error ts-migrate(2339) FIXME: Property 'components' does not exist on type 'Obje... Remove this comment to see the full error message
            if (fileCopy.components && fileCopy.components.length) {
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'components' does not exist on type 'Obje... Remove this comment to see the full error message
              components = fileCopy.components.reduce(
                (newComps: Object, curComp: Object): Object => {
                  const compCopy: Object = { ...curComp };

                  // @ts-expect-error ts-migrate(2339) FIXME: Property 'created' does not exist on type 'Object'... Remove this comment to see the full error message
                  const createdComp: string = moment(compCopy.created).format(
                    'YYYY-MM-DD HH:mm:ss'
                  );
                  // @ts-expect-error ts-migrate(2339) FIXME: Property 'modified' does not exist on type 'Object... Remove this comment to see the full error message
                  const updatedComp: string = moment(compCopy.modified).format(
                    'YYYY-MM-DD HH:mm:ss'
                  );

                  return {
                    ...newComps,
                    ...{
                      // @ts-expect-error ts-migrate(2339) FIXME: Property 'component' does not exist on type 'Objec... Remove this comment to see the full error message
                      [`${compCopy.component} v${compCopy.version} (${
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
                        compCopy.id
                      })`]: {
                        Timestamps: `Created: ${createdComp} Updated: ${updatedComp}`,
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'hash_type' does not exist on type 'Objec... Remove this comment to see the full error message
                        Info: `${compCopy.hash_type} - ${compCopy.hash}`,
                      },
                    },
                  };
                },
                {}
              );
            }

            // @ts-expect-error ts-migrate(2339) FIXME: Property 'created' does not exist on type 'Object'... Remove this comment to see the full error message
            const createdFile: string = moment(fileCopy.created).format(
              'YYYY-MM-DD HH:mm:ss'
            );
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'modified' does not exist on type 'Object... Remove this comment to see the full error message
            const updatedFile: string = moment(fileCopy.modified).format(
              'YYYY-MM-DD HH:mm:ss'
            );

            return {
              ...newFiles,
              ...{
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                [fileCopy.name]: {
                  Timestamps: `Created: ${createdFile} Updated: ${updatedFile}`,
                  // @ts-expect-error ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
                  Info: `${fileCopy.type} - ${fileCopy.hash_type} - ${
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'hash' does not exist on type 'Object'.
                    fileCopy.hash
                  }`,
                  ...components,
                },
              },
            };
          },
          {}
        );
      }

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'created' does not exist on type 'Object'... Remove this comment to see the full error message
      const created: string = moment(copy.created).format(
        'YYYY-MM-DD HH:mm:ss'
      );
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'modified' does not exist on type 'Object... Remove this comment to see the full error message
      const updated: string = moment(copy.modified).format(
        'YYYY-MM-DD HH:mm:ss'
      );

      return {
        ...newData,
        ...{
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
          [`[${created}] ${copy.name}`]: {
            Timestamps: `Created: ${created} Updated: ${updated}`,
            ...files,
          },
        },
      };
    },
    {}
  );

  return res;
};

const sortReleases: Function = (sort: string, sortDir: string): Function => (
  data: Array<Object>
): Array<Object> =>
  data.length
    ? sortTable(data, {
        sortBy: sort === 'Date' ? 'created' : sort.toLowerCase(),
        sortByKey: {
          direction: sortDir === 'Ascending' ? 1 : -1,
          ignoreCase: true,
        },
      })
    : [];

const releaseSelector: Function = createSelector(
  [resourceSelector('releases')],
  (releases: Object) =>
    compose(
      formatReleases(),
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'sort' does not exist on type 'Object'.
      sortReleases(releases.sort, releases.sortDir)
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    )(releases.data)
);

const componentSelector = (
  state: Object,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'compact' does not exist on type 'Object'... Remove this comment to see the full error message
  { compact, location, component }: Object
): string => (compact ? component : location.query.component);

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
    // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    fileName: ?string,
    // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    component: ?string,
    // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    maxdate: ?string,
    // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    mindate: ?string
  ): Object => ({
    meta: releases,
    data,
    fileName,
    component,
    maxdate,
    mindate,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'sort' does not exist on type 'Object'.
    sort: releases.sort,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'sortDir' does not exist on type 'Object'... Remove this comment to see the full error message
    sortDir: releases.sortDir,
  })
);

export default compose(
  connect(
    viewSelector,
    {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'releases' does not exist on type '{}'.
      load: actions.releases.fetchReleases,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'releases' does not exist on type '{}'.
      fetch: actions.releases.fetchReleases,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'releases' does not exist on type '{}'.
      unsync: actions.releases.unsync,
    }
  ),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 2.
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

      if (
        (mindate !== nextProps.mindate ||
          maxdate !== nextProps.maxdate ||
          fileName !== nextProps.fileName ||
          component !== nextProps.component) &&
        nextProps.offset !== 0
      ) {
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
          nextProps.offset !== 0
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
