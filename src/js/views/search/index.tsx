// @flow
import React from 'react';

import Orders from './orders';
import Errors from './errors';
import { Breadcrumbs, Crumb, CrumbTabs } from '../../components/breadcrumbs';
import { SimpleTabs, SimpleTab } from '../../components/SimpleTabs';
import withTabs from '../../hocomponents/withTabs';
import withModal from '../../hocomponents/modal';
import compose from 'recompose/compose';
import titleManager from '../../hocomponents/TitleManager';
import Headbar from '../../components/Headbar';
import Pull from '../../components/Pull';
import {
  Controls as ButtonGroup,
  Control as Button,
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
} from '../../components/controls';
import withHandlers from 'recompose/withHandlers';
import actions from '../../store/api/actions';
import queryControl from '../../hocomponents/queryControl';
import { connect } from 'react-redux';
import HistoryModal from './modals/history';
import Flex from '../../components/Flex';
import hasInterfaceAccess from '../../hocomponents/hasInterfaceAccess';

type Props = {
  location: Object,
  tabQuery: string,
  handleTabChange: Function,
  onSaveClick: Function,
  onHistoryClick: Function,
  onClearClick: Function,
};

const Search: Function = ({
  location,
  tabQuery,
  onSaveClick,
  onHistoryClick,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  <Flex>
    <Headbar>
      <Breadcrumbs>
        <Crumb>Search</Crumb>
        <CrumbTabs tabs={['Orders', 'Errors']} />
      </Breadcrumbs>
      <Pull right>
        <ButtonGroup>
          <Button
            text="Save search"
            icon="floppy-disk"
            onClick={onSaveClick}
            big
          />
          <Button
            text="Show saved searches"
            icon="history"
            onClick={onHistoryClick}
            big
          />
        </ButtonGroup>
      </Pull>
    </Headbar>
    <SimpleTabs activeTab={tabQuery}>
      <SimpleTab name="orders">
        <Orders location={location} />
      </SimpleTab>
      <SimpleTab name="errors">
        <Errors location={location} />
      </SimpleTab>
    </SimpleTabs>
  </Flex>
);

export default compose(
  hasInterfaceAccess('workflows', 'Orders', 'Search'),
  withModal(),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
  withTabs('orders'),
  connect(
    (state: Object) => ({
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      username: state.api.currentUser.data.username,
    }),
    {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'currentUser' does not exist on type '{}'... Remove this comment to see the full error message
      saveSearch: actions.currentUser.storeSearch,
    }
  ),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 0.
  queryControl(),
  withHandlers({
    onSaveClick: ({
      allQuery,
      tabQuery,
      saveSearch,
      username,
    }): Function => (): void => {
      saveSearch(`${tabQuery}Search`, allQuery, username);
    },
    onHistoryClick: ({
      openModal,
      closeModal,
      tabQuery,
    }): Function => (): void => {
      openModal(
        <HistoryModal type={`${tabQuery}Search`} onClose={closeModal} />
      );
    },
  }),
  titleManager('Search')
)(Search);
