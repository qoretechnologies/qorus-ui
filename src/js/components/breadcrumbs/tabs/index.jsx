// @flow
import React from 'react';
import { findDOMNode } from 'react-dom';
import Pull from '../../Pull';
import withTabs from '../../../hocomponents/withTabs';
import capitalize from 'lodash/capitalize';
import isString from 'lodash/isString';

import CrumbTab from './tab';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Popover, Menu, MenuItem, Position } from '@blueprintjs/core';
import mapProps from 'recompose/mapProps';
import { connect } from 'react-redux';
import ResizeObserver from 'resize-observer-polyfill';
import { Link } from 'react-router';
import { buildPageLinkWithQueries } from '../../../helpers/router';
import { injectIntl } from 'react-intl';

type Props = {
  tabs: Array<any>,
  handleTabChange: Function,
  onChange?: Function,
  tabQuery?: string,
  activeTab?: string,
  compact?: boolean,
  queryIdentifier?: string,
  width: number,
  local: boolean,
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
          Array.from(element.children).forEach(childElement => {
            if (childElement.tagName === 'LI') {
              childrenWidth =
                childrenWidth + childElement.getBoundingClientRect().width;
            }
          });
        } else {
          childrenWidth = childrenWidth + element.getBoundingClientRect().width;
        }
      });

      let tabsLen: number = 0;
      const spaceWidth: number = parentWidth - childrenWidth;
      let tabsWidth: number = 0;
      let collapsed: boolean = false;
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
    const {
      tabs,
      handleTabChange,
      tabQuery,
      queryIdentifier: queryIdentifier = 'tab',
      local,
    }: Props = this.props;
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
      (tab: Object): boolean => tab.tabId === capitalize(tabQuery)
    );

    return (
      <Pull className="breadcrumb-tabs" handleRef={this.handleRef}>
        {showTabs && [
          newTabs.map((tab: Object): React.Element<CrumbTab> => (
            <CrumbTab
              key={tab.title}
              active={tab.tabId.toLowerCase() === tabQuery}
              title={tab.title}
              tabId={tab.tabId}
              onClick={handleTabChange}
              local={local}
              queryIdentifier={queryIdentifier}
            />
          )),
          leftoverTabs.length !== 0 && (
            <Popover
              position={Position.BOTTOM}
              useSmartPositioning
              useSmartArrowPositioning
              key="crumbtabs-popover"
              content={
                <Menu>
                  {leftoverTabs
                    .filter(
                      (tab: Object): boolean =>
                        tab.tabId.toLowerCase() !== tabQuery
                    )
                    .map((tab: Object): React.Element<MenuItem> =>
                      local ? (
                        <MenuItem
                          key={tab.title}
                          text={tab.title}
                          onClick={() =>
                            handleTabChange(tab.tabId.toLowerCase())
                          }
                        />
                      ) : (
                        <Link
                          to={buildPageLinkWithQueries(
                            queryIdentifier,
                            tab.tabId
                          )}
                          className="non-decorated-link"
                        >
                          <MenuItem key={tab.title} text={tab.title} />
                        </Link>
                      )
                    )}
                </Menu>
              }
            >
              <CrumbTab
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
  connect((state: Object): Object => ({
    windowWidth: state.ui.settings.width,
    language: state.api.currentUser.data.storage.locale,
  })),
  mapProps(({ tabs, width, windowWidth, intl, ...rest }: Props): Props => ({
    tabs: tabs.map((tab: any): Object =>
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
  })),
  withTabs(
    ({ defaultTab, tabs }) => defaultTab || tabs[0].tabId.toLowerCase(),
    ({ queryIdentifier }) => queryIdentifier || 'tab',
    ({ isPane }) => !!isPane
  ),
  mapProps(
    ({
      local,
      tabQuery,
      handleTabChange,
      activeTab,
      onChange,
      ...rest
    }: Props): Props => ({
      tabQuery: local ? activeTab : tabQuery,
      handleTabChange: local ? onChange : handleTabChange,
      local,
      ...rest,
    })
  ),
  onlyUpdateForKeys(['tabQuery', 'tabs', 'width'])
)(CrumbTabs);
