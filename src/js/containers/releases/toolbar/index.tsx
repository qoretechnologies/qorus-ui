// @flow
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import pure from 'recompose/onlyUpdateForKeys';

import Toolbar from '../../../components/toolbar';
import actions from '../../../store/api/actions';
import Dropdown, { Control, Item } from '../../../components/dropdown';
import SearchBar from './search';
import { Breadcrumbs, Crumb } from '../../../components/breadcrumbs';
import { injectIntl, FormattedMessage } from 'react-intl';

type Props = {
  sort: string,
  compact: boolean,
  sortDir: boolean,
  changeSort: Function,
  changeSortDir: Function,
  handleSortChange: Function,
  handleSortDirChange: Function,
};

const ReleasesToolbar: Function = ({
  sort,
  sortDir,
  handleSortChange,
  handleSortDirChange,
  compact,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  <Toolbar marginBottom>
    <div className="pull-left clear">
      <Dropdown id="release-sort">
        { /* @ts-expect-error ts-migrate(2739) FIXME: Type '{ children: any[]; }' is missing the followi... Remove this comment to see the full error message */ }
        <Control><FormattedMessage id='dropdown.sort-by' />:{' '}
          {
            sort === 'Name'
              ? intl.formatMessage({ id: 'dropdown.name' })
              : (sort === 'Date'
                ? intl.formatMessage({ id: 'dropdown.date' })
                : sort
              )
          }
        </Control>
        <Item
          title={intl.formatMessage({ id: 'dropdown.name' })}
          // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
          action={handleSortChange}
        />
        <Item
          title={intl.formatMessage({ id: 'dropdown.date' })}
          // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
          action={handleSortChange}
        />
      </Dropdown>{' '}
      <Dropdown id="release-sortDir">
        { /* @ts-expect-error ts-migrate(2739) FIXME: Type '{ children: any[]; }' is missing the followi... Remove this comment to see the full error message */ }
        <Control><FormattedMessage id='dropdown.sort-direction' />:{' '}
          {
            // @ts-expect-error ts-migrate(2367) FIXME: This condition will always return 'false' since th... Remove this comment to see the full error message
            sortDir === 'Descending'
              ? intl.formatMessage({ id: 'dropdown.descending' })
              // @ts-expect-error ts-migrate(2367) FIXME: This condition will always return 'false' since th... Remove this comment to see the full error message
              : (sortDir === 'Ascending'
                ? intl.formatMessage({ id: 'dropdown.ascending' })
                : sortDir
              )
          }
        </Control>
        <Item
          title={intl.formatMessage({ id: 'dropdown.descending' })}
          // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
          action={handleSortDirChange}
        />
        <Item
          title={intl.formatMessage({ id: 'dropdown.ascending' })}
          // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
          action={handleSortDirChange}
        />
      </Dropdown>
    </div>
    {!compact && <SearchBar />}
  </Toolbar>
);

export default compose(
  connect(
    null,
    {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'releases' does not exist on type '{}'.
      changeSort: actions.releases.changeSort,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'releases' does not exist on type '{}'.
      changeSortDir: actions.releases.changeSortDir,
    }
  ),
  withHandlers({
    handleSortChange: ({ changeSort }: Props): Function => (
      event: Object,
      value: string
    ): void => {
      changeSort(value);
    },
    handleSortDirChange: ({ changeSortDir }: Props): Function => (
      event: Object,
      value: string
    ): void => {
      changeSortDir(value);
    },
  }),
  pure(['sort', 'sortDir']),
  injectIntl
)(ReleasesToolbar);
