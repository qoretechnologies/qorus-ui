// @flow
import { Menu, MenuItem, Popover, Position } from '@blueprintjs/core';
import capitalize from 'lodash/capitalize';
import isString from 'lodash/isString';
import React from 'react';
import { findDOMNode } from 'react-dom';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import ResizeObserver from 'resize-observer-polyfill';
import { buildPageLinkWithQueries } from '../../../helpers/router';
import withTabs from '../../../hocomponents/withTabs';
import Pull from '../../Pull';
import CrumbTab from './tab';

type Props = {
  tabs: Array<any>;
  handleTabChange: Function;
  onChange?: Function;
  tabQuery?: string;
  activeTab?: string;
  compact?: boolean;
  queryIdentifier?: string;
  width: number;
  local: boolean;
};

@injectIntl
class CrumbTabs extends React.Component {
  props: Props = this.props;

  _tabsWrapper: any;

  state = {
    showTabs: false,
    tabsLen: 0,
  };

  handleRef: Function = (ref: any): void => {
    if (ref) {
      this._tabsWrapper = ref;

      const ro = new ResizeObserver((entries, observer) => {
        this.handleTabsResize();
      });

      const parent: any = findDOMNode(this._tabsWrapper).parentNode.parentNode;
      ro.observe(parent);

      this.handleTabsResize();
    }
  };

  handleTabsResize: Function = (): void => {
    if (this._tabsWrapper) {
      const parent: any = findDOMNode(this._tabsWrapper).parentNode.parentNode;

      let childrenWidth: number = 0;
      const parentWidth: number = parent.getBoundingClientRect().width;

      Array.from(parent.children).forEach((element, index) => {
        if (index === 0) {
          // @ts-ignore ts-migrate(2339) FIXME: Property 'children' does not exist on type 'unknow... Remove this comment to see the full error message
          Array.from(element.children).forEach((childElement) => {
            // @ts-ignore ts-migrate(2339) FIXME: Property 'tagName' does not exist on type 'unknown... Remove this comment to see the full error message
            if (childElement.tagName === 'LI') {
              childrenWidth =
                // @ts-ignore ts-migrate(2339) FIXME: Property 'getBoundingClientRect' does not exist on... Remove this comment to see the full error message
                childrenWidth + childElement.getBoundingClientRect().width;
            }
          });
        } else {
          // @ts-ignore ts-migrate(2339) FIXME: Property 'getBoundingClientRect' does not exist on... Remove this comment to see the full error message
          childrenWidth = childrenWidth + element.getBoundingClientRect().width;
        }
      });

      let tabsLen: number = 0;
      const spaceWidth: number = parentWidth - childrenWidth;
      let tabsWidth: number = 0;
      let collapsed: boolean = false;
      // @ts-ignore ts-migrate(2339) FIXME: Property 'language' does not exist on type 'Props'... Remove this comment to see the full error message
      const characterLength = this.props.language === 'ja-JP' ? 1.8 : 1;

      this.props.tabs.forEach((tab: any): void => {
        const strLen: number = tab.title.length * characterLength;
        if (strLen * 10.5 + tabsWidth < spaceWidth) {
          tabsLen = tabsLen + 1;
          tabsWidth = tabsWidth + strLen * 10.5;
        } else {
          collapsed = true;
        }
      });

      this.setState(() => ({
        showTabs: true,
        tabsLen: collapsed ? tabsLen - 1 : tabsLen,
      }));
    }
  };

  render() {
    const { tabs, handleTabChange, tabQuery, queryIdentifier = 'tab', local }: Props = this.props;
    const { tabsLen, showTabs } = this.state;
    const tabsCollapsed: boolean = tabs.length > tabsLen;

    let newTabs: Array<any> = tabs;
    let leftoverTabs: Array<any> = [];

    //* There is more tabs than we can display
    if (tabsCollapsed) {
      newTabs = tabs.slice(0, tabsLen - 1);
      leftoverTabs = tabs.slice(tabsLen - 1, tabs.length);
    }

    const leftoverTabSelected = leftoverTabs.find(
      // @ts-ignore ts-migrate(2339) FIXME: Property 'tabId' does not exist on type 'Object'.
      (tab: any): boolean => tab.tabId === capitalize(tabQuery)
    );

    return (
      <Pull className="breadcrumb-tabs" handleRef={this.handleRef}>
        {showTabs && [
          newTabs.map(
            // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
            (tab: any) => (
              <CrumbTab
                // @ts-ignore ts-migrate(2339) FIXME: Property 'title' does not exist on type 'Object'.
                key={tab.title}
                // @ts-ignore ts-migrate(2339) FIXME: Property 'tabId' does not exist on type 'Object'.
                active={tab.tabId.toLowerCase() === tabQuery}
                // @ts-ignore ts-migrate(2339) FIXME: Property 'title' does not exist on type 'Object'.
                title={tab.title}
                // @ts-ignore ts-migrate(2339) FIXME: Property 'tabId' does not exist on type 'Object'.
                tabId={tab.tabId}
                onClick={handleTabChange}
                local={local}
                queryIdentifier={queryIdentifier}
              />
            )
          ),
          leftoverTabs.length !== 0 && (
            <Popover
              position={Position.BOTTOM}
              // @ts-ignore ts-migrate(2322) FIXME: Type '{ children: Element; position: "bottom"; use... Remove this comment to see the full error message
              useSmartPositioning
              useSmartArrowPositioning
              key="crumbtabs-popover"
              content={
                <Menu>
                  {leftoverTabs
                    .filter(
                      (tab: any): boolean =>
                        // @ts-ignore ts-migrate(2339) FIXME: Property 'tabId' does not exist on type 'Object'.
                        tab.tabId.toLowerCase() !== tabQuery
                    )
                    .map(
                      // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
                      (tab: any) =>
                        local ? (
                          <MenuItem
                            // @ts-ignore ts-migrate(2339) FIXME: Property 'title' does not exist on type 'Object'.
                            key={tab.title}
                            // @ts-ignore ts-migrate(2339) FIXME: Property 'title' does not exist on type 'Object'.
                            text={tab.title}
                            onClick={() =>
                              // @ts-ignore ts-migrate(2339) FIXME: Property 'tabId' does not exist on type 'Object'.
                              handleTabChange(tab.tabId.toLowerCase())
                            }
                          />
                        ) : (
                          <Link
                            to={buildPageLinkWithQueries(
                              queryIdentifier,
                              // @ts-ignore ts-migrate(2339) FIXME: Property 'tabId' does not exist on type 'Object'.
                              tab.tabId
                            )}
                            className="non-decorated-link"
                          >
                            {/* @ts-ignore ts-migrate(2339) FIXME: Property 'title' does not exist on type 'Object'. */}
                            <MenuItem key={tab.title} text={tab.title} />
                          </Link>
                        )
                    )}
                </Menu>
              }
            >
              <CrumbTab
                // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
                title={this.props.intl.formatMessage({
                  id: leftoverTabSelected ? capitalize(tabQuery) : 'More...',
                })}
                active={leftoverTabSelected}
                compact
              />
            </Popover>
          ),
        ]}
      </Pull>
    );
  }
}

export default compose(
  injectIntl,
  connect((state: any): any => ({
    // @ts-ignore ts-migrate(2339) FIXME: Property 'ui' does not exist on type 'Object'.
    windowWidth: state.ui.settings.width,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
    language: state.api.currentUser.data.storage.locale,
  })),
  mapProps(
    // @ts-ignore ts-migrate(2339) FIXME: Property 'windowWidth' does not exist on type 'Pro... Remove this comment to see the full error message
    ({ tabs, width, windowWidth, intl, ...rest }: Props): Props => ({
      tabs: tabs.map((tab: any): any =>
        isString(tab)
          ? { title: intl.formatMessage({ id: tab }), tabId: tab }
          : {
              title: `${intl.formatMessage({ id: tab.title })}${
                tab.suffix ? ` ${tab.suffix}` : ''
              }`,
              tabId: tab.title,
            }
      ),
      width: width || windowWidth,
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
)(CrumbTabs);
