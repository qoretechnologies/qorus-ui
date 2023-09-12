// @flow
import { ReqoreIcon, ReqoreTabs } from '@qoretechnologies/reqore';
import isString from 'lodash/isString';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { buildPageLinkWithQueries } from '../../../helpers/router';
import withTabs from '../../../hocomponents/withTabs';

type Props = {
  tabs: Array<any>;
  handleTabChange: Function;
  onTabChange?: any;
  onChange?: Function;
  tabQuery?: string;
  activeTab?: string;
  compact?: boolean;
  queryIdentifier?: string;
  width: number;
  local: boolean;
  isPane?: boolean;
};

export const Tabs = ({
  tabs,
  tabQuery,
  handleTabChange,
  queryIdentifier,
  local,
  isPane,
}: Props) => {
  return (
    <>
      {!isPane && <ReqoreIcon icon="ArrowRightSLine" />}
      <ReqoreTabs
        padded={false}
        activeTabIntent="info"
        activeTab={tabQuery}
        tabs={tabs.map((tab) => ({
          label: tab.title,
          badge: tab.badge,
          id: tab.tabId.toLowerCase(),
          as: local ? undefined : Link,
          props: local ? undefined : { to: buildPageLinkWithQueries(queryIdentifier, tab.tabId) },
        }))}
        onTabChange={handleTabChange}
      />
    </>
  );
};

export default compose(
  connect((state: any): any => ({
    // @ts-ignore ts-migrate(2339) FIXME: Property 'ui' does not exist on type 'Object'.
    windowWidth: state.ui.settings.width,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
    language: state.api.currentUser.data.storage.locale,
  })),
  injectIntl,
  mapProps(
    // @ts-ignore ts-migrate(2339) FIXME: Property 'windowWidth' does not exist on type 'Pro... Remove this comment to see the full error message
    ({ tabs, width, windowWidth, intl, ...rest }: Props): Props => ({
      tabs: tabs.map((tab: any): any =>
        isString(tab)
          ? { title: intl.formatMessage({ id: tab }), tabId: tab }
          : {
              title: `${intl.formatMessage({ id: tab.title })}`,
              badge: tab.suffix,
              tabId: tab.title,
            }
      ),
      ...rest,
    })
  ),
  withTabs(
    ({ defaultTab, tabs }) => defaultTab || tabs[0].tabId.toLowerCase(),
    ({ queryIdentifier }) => queryIdentifier || 'tab',
    ({ isPane }) => !!isPane
  ),
  mapProps(
    ({ local, tabQuery, handleTabChange, activeTab, onChange, ...rest }: Props): Props => ({
      tabQuery: local ? activeTab : tabQuery,
      handleTabChange: local ? onChange : handleTabChange,
      local,
      ...rest,
    })
  ),
  onlyUpdateForKeys(['tabQuery', 'tabs', 'width'])
)(injectIntl(Tabs as any) as any);
