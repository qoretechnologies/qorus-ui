// @flow
import React from 'react';
import { findDOMNode } from 'react-dom';
import Pull from '../../Pull';
import withTabs from '../../../hocomponents/withTabs';
import capitalize from 'lodash/capitalize';
import includes from 'lodash/includes';

import CrumbTab from './tab';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Popover, Menu, MenuItem, Position } from '@blueprintjs/core';
import lifecycle from 'recompose/lifecycle';

type Props = {
  tabs: Array<string>,
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

  handleTabsResize: Function = (props: Props): void => {
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
        tabsLen: Math.floor((parentWidth - childrenWidth) / 117),
      }));
    }
  };

  render() {
    const { tabs, handleTabChange, tabQuery, compact }: Props = this.props;
    const { tabsLen } = this.state;
    const tabsCollapsed = tabs.length > tabsLen;
    let newTabs: Array<string> = tabs;
    let leftoverTabs: Array<string> = [];

    //* There is more tabs than we can display
    if (tabsCollapsed) {
      newTabs = tabs.slice(0, tabsLen - 1);
      leftoverTabs = tabs.slice(tabsLen - 1, tabs.length);
    }

    const leftoverTabSelected = includes(leftoverTabs, capitalize(tabQuery));

    console.log(leftoverTabSelected);

    return (
      <Pull className="breadcrumb-tabs" handleRef={this.handleRef}>
        {newTabs.map(
          (tab: string): React.Element<CrumbTab> => (
            <CrumbTab
              key={tab}
              active={tab.toLowerCase() === tabQuery}
              title={tab}
              onClick={handleTabChange}
            />
          )
        )}
        {leftoverTabs.length !== 0 && (
          <Popover
            position={Position.BOTTOM}
            useSmartPositioning
            useSmartArrowPositioning
            content={
              <Menu>
                {leftoverTabs
                  .filter(
                    (tab: string): boolean => tab.toLowerCase() !== tabQuery
                  )
                  .map(
                    (tab: string): React.Element<MenuItem> => (
                      <MenuItem
                        key={tab}
                        text={tab}
                        onClick={() => handleTabChange(tab.toLowerCase())}
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
        )}
      </Pull>
    );
  }
}

export default compose(
  withTabs(
    ({ defaultTab, tabs }) => defaultTab || tabs[0].toLowerCase(),
    ({ queryIdentifier }) => queryIdentifier || 'tab'
  ),
  onlyUpdateForKeys(['tabQuery', 'tabs', 'parentRef'])
)(CrumbTabs);
