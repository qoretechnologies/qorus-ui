// @flow
import { createAction } from 'redux-actions';
import { fetchJson } from '../../utils';
import settings from '../../../../settings';

const fetchReleases: Function = createAction(
  'RELEASES_FETCHRELEASES',
  async (
    fileName,
    component,
    maxdate,
    mindate,
    limit,
    offset,
    fetchMore,
  ) => {
    let url = `${settings.REST_BASE_URL}/releases?with_components=1` +
      `&limit=${limit}` +
      `&offset=${offset}`;

    if (fileName && fileName !== 'fileName') {
      url += `&file_name=${fileName}`;
    }

    if (component && component !== 'component') {
      url += `&component=${component}`;
    }

    if (maxdate && maxdate !== 'maxdate') {
      url += `&maxdate=${maxdate}`;
    }

    if (mindate && mindate !== 'mindate') {
      url += `&mindate=${mindate}`;
    }

    // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    const releases: Promise<*> = await fetchJson(
      'GET',
      url,
      null,
      true
    );

    return {
      releases,
      fetchMore,
    };
  }
);

const changeOffset: Function = createAction(
  'RELEASES_CHANGEOFFSET',
  (newOffset: number): Object => (
    { newOffset }
  )
);

const changeSort: Function = createAction(
  'RELEASES_CHANGESORT',
  (newSort: string): Object => (
    { newSort }
  )
);

const changeSortDir: Function = createAction(
  'RELEASES_CHANGESORTDIR',
  (newSortDir: string): Object => (
    { newSortDir }
  )
);

const unsync: Function = createAction(
  'RELEASES_UNSYNC',
);

export {
  fetchReleases,
  changeOffset,
  changeSort,
  changeSortDir,
  unsync,
};
