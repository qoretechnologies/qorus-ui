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
  intl,
}: Props): React.Element<any> => (
  <Toolbar marginBottom>
    <div className="pull-left clear">
      <Dropdown id="release-sort">
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
          action={handleSortChange}
        />
        <Item
          title={intl.formatMessage({ id: 'dropdown.date' })}
          action={handleSortChange}
        />
      </Dropdown>{' '}
      <Dropdown id="release-sortDir">
        <Control><FormattedMessage id='dropdown.sort-direction' />:{' '}
          {
            sortDir === 'Descending'
              ? intl.formatMessage({ id: 'dropdown.descending' })
              : (sortDir === 'Ascending'
                ? intl.formatMessage({ id: 'dropdown.ascending' })
                : sortDir
              )
          }
        </Control>
        <Item
          title={intl.formatMessage({ id: 'dropdown.descending' })}
          action={handleSortDirChange}
        />
        <Item
          title={intl.formatMessage({ id: 'dropdown.ascending' })}
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
      changeSort: actions.releases.changeSort,
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
