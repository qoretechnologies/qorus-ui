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

type Props = {
  tabs: Array<any>,
  handleTabChange: Function,
  tabQuery?: string,
  compact?: boolean,
  queryIdentifier?: string,
  parentRef: HTMLDivElement,
  width: number,
};

class CrumbTabs extends React.Component {
  props: Props;

  _tabsWrapper: any;

  state = {
    showTabs: false,
    tabsLen: 0,
  };

  componentWillReceiveProps(nextProps: Props): void {
    if (this.props.width !== nextProps.width) {
      this.handleTabsResize(nextProps);
    }
  }

  handleRef: Function = (ref: any): void => {
    if (ref) {
      this._tabsWrapper = ref;

      this.handleTabsResize(this.props);
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

      this.setState(() => ({
        showTabs: true,
        tabsLen: Math.floor((parentWidth - childrenWidth) / 117),
      }));
    }
  };

  render() {
    const { tabs, handleTabChange, tabQuery }: Props = this.props;
    const { tabsLen, showTabs } = this.state;
    const tabsCollapsed = tabs.length > tabsLen;

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
          newTabs.map(
            (tab: Object): React.Element<CrumbTab> => (
              <CrumbTab
                key={tab.title}
                active={tab.tabId.toLowerCase() === tabQuery}
                title={tab.title}
                tabId={tab.tabId}
                onClick={handleTabChange}
              />
            )
          ),
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
                    .map(
                      (tab: Object): React.Element<MenuItem> => (
                        <MenuItem
                          key={tab.title}
                          text={tab.title}
                          onClick={() =>
                            handleTabChange(tab.tabId.toLowerCase())
                          }
                        />
                      )
                    )}
                </Menu>
              }
            >
              <CrumbTab
                title={leftoverTabSelected ? capitalize(tabQuery) : 'More...'}
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
  mapProps(
    ({ tabs, ...rest }: Props): Props => ({
      tabs: tabs.map(
        (tab: any): Object =>
          isString(tab)
            ? { title: tab, tabId: tab }
            : {
                title: `${tab.title}${tab.suffix ? ` ${tab.suffix}` : ''}`,
                tabId: tab.title,
              }
      ),
      ...rest,
    })
  ),
  withTabs(
    ({ defaultTab, tabs }) => defaultTab || tabs[0].tabId.toLowerCase(),
    ({ queryIdentifier }) => queryIdentifier || 'tab'
  ),
  onlyUpdateForKeys(['tabQuery', 'tabs', 'parentRef'])
)(CrumbTabs);
