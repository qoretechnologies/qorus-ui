// @flow
import { ReqoreControlGroup } from '@qoretechnologies/reqore';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import Flex from '../../components/Flex';
import { SimpleTab, SimpleTabs } from '../../components/SimpleTabs';
import { Breadcrumbs, Crumb, CrumbTabs } from '../../components/breadcrumbs';
import { Control as Button, Controls as ButtonGroup } from '../../components/controls';
import titleManager from '../../hocomponents/TitleManager';
import hasInterfaceAccess from '../../hocomponents/hasInterfaceAccess';
import withModal from '../../hocomponents/modal';
import queryControl from '../../hocomponents/queryControl';
import withTabs from '../../hocomponents/withTabs';
import actions from '../../store/api/actions';
import Errors from './errors';
import HistoryModal from './modals/history';
import Orders from './orders';

type Props = {
  location: any;
  tabQuery: string;
  handleTabChange: Function;
  onSaveClick: Function;
  onHistoryClick: Function;
  onClearClick: Function;
};

const Search: Function = ({
  location,
  tabQuery,
  onSaveClick,
  onHistoryClick,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => {
  console.log('Search View Updated');
  return (
    <Flex>
      <Breadcrumbs>
        <Crumb>Search</Crumb>
        <CrumbTabs tabs={['Orders', 'Errors']} />
        <ReqoreControlGroup fixed style={{ marginLeft: 'auto' }}>
          <ButtonGroup>
            <Button text="Save search" icon="floppy-disk" onClick={onSaveClick} big />
            <Button text="Show saved searches" icon="history" onClick={onHistoryClick} big />
          </ButtonGroup>
        </ReqoreControlGroup>
      </Breadcrumbs>

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
};

export default compose(
  hasInterfaceAccess('workflows', 'Orders', 'Search'),
  withModal(),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
  withTabs('orders'),
  connect(
    (state: any) => ({
      // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      username: state.api.currentUser.data.username,
    }),
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'currentUser' does not exist on type '{}'... Remove this comment to see the full error message
      saveSearch: actions.currentUser.storeSearch,
    }
  ),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 0.
  queryControl(),
  withHandlers({
    onSaveClick:
      ({ allQuery, tabQuery, saveSearch, username }): Function =>
      (): void => {
        saveSearch(`${tabQuery}Search`, allQuery, username);
      },
    onHistoryClick:
      ({ openModal, closeModal, tabQuery }): Function =>
      (): void => {
        openModal(<HistoryModal type={`${tabQuery}Search`} onClose={closeModal} />);
      },
  }),
  titleManager('Search')
)(Search);
