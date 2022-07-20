// @flow
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import Dropdown, { Control, Item } from '../../../components/dropdown';
import Toolbar from '../../../components/toolbar';
import actions from '../../../store/api/actions';
import SearchBar from './search';

type Props = {
  sort: string;
  compact: boolean;
  sortDir: boolean;
  changeSort: Function;
  changeSortDir: Function;
  handleSortChange: Function;
  handleSortDirChange: Function;
};

const ReleasesToolbar: Function = ({
  sort,
  sortDir,
  handleSortChange,
  handleSortDirChange,
  compact,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <Toolbar marginBottom>
    <div className="pull-left clear">
      <Dropdown id="release-sort">
        {/* @ts-ignore ts-migrate(2739) FIXME: Type '{ children: any[]; }' is missing the followi... Remove this comment to see the full error message */}
        <Control>
          <FormattedMessage id="dropdown.sort-by" />:{' '}
          {sort === 'Name'
            ? intl.formatMessage({ id: 'dropdown.name' })
            : sort === 'Date'
            ? intl.formatMessage({ id: 'dropdown.date' })
            : sort}
        </Control>
        <Item
          title={intl.formatMessage({ id: 'dropdown.name' })}
          // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
          action={handleSortChange}
        />
        <Item
          title={intl.formatMessage({ id: 'dropdown.date' })}
          // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
          action={handleSortChange}
        />
      </Dropdown>{' '}
      <Dropdown id="release-sortDir">
        {/* @ts-ignore ts-migrate(2739) FIXME: Type '{ children: any[]; }' is missing the followi... Remove this comment to see the full error message */}
        <Control>
          <FormattedMessage id="dropdown.sort-direction" />:{' '}
          {
            // @ts-ignore ts-migrate(2367) FIXME: This condition will always return 'false' since th... Remove this comment to see the full error message
            sortDir === 'Descending'
              ? intl.formatMessage({ id: 'dropdown.descending' })
              : // @ts-ignore ts-migrate(2367) FIXME: This condition will always return 'false' since th... Remove this comment to see the full error message
              sortDir === 'Ascending'
              ? intl.formatMessage({ id: 'dropdown.ascending' })
              : sortDir
          }
        </Control>
        <Item
          title={intl.formatMessage({ id: 'dropdown.descending' })}
          // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
          action={handleSortDirChange}
        />
        <Item
          title={intl.formatMessage({ id: 'dropdown.ascending' })}
          // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
          action={handleSortDirChange}
        />
      </Dropdown>
    </div>
    {!compact && <SearchBar />}
  </Toolbar>
);

export default compose(
  connect(null, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'releases' does not exist on type '{}'.
    changeSort: actions.releases.changeSort,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'releases' does not exist on type '{}'.
    changeSortDir: actions.releases.changeSortDir,
  }),
  withHandlers({
    handleSortChange:
      ({ changeSort }: Props): Function =>
      (event: any, value: string): void => {
        changeSort(value);
      },
    handleSortDirChange:
      ({ changeSortDir }: Props): Function =>
      (event: any, value: string): void => {
        changeSortDir(value);
      },
  }),
  pure(['sort', 'sortDir']),
  injectIntl
)(ReleasesToolbar);
