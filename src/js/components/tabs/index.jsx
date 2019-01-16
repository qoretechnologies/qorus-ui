import React from 'react';
import upperFirst from 'lodash/upperFirst';

import Flex from '../Flex';
import { SimpleTabs, SimpleTab } from '../SimpleTabs';
import Headbar from '../Headbar';
import Pane from './pane';
import pure from 'recompose/onlyUpdateForKeys';
import { Breadcrumbs, CrumbTabs } from '../breadcrumbs';
import Pull from '../Pull';

type Props = {
  children?: any,
  active?: string,
  onChange: Function,
  onChangeEnd?: Function,
  tabs: Array<any>,
  rightElement?: any,
};

@pure(['children', 'active', 'vertical', 'noContainer', 'tabs', 'rightElement'])
class Tabs extends React.Component {
  props: Props = this.props;
  state: {
    active?: string,
  } = {
    active: this.props.active,
  };

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.active !== nextProps.active) {
      this.setState({
        active: nextProps.active,
      });
    }
  }

  handleChange: Function = (tabId: string): void => {
    if (this.props.onChange) {
      this.props.onChange(tabId);
    } else {
      this.setState({
        active: tabId,
      });
    }

    if (this.props.onChangeEnd) {
      this.props.onChangeEnd(tabId);
    }
  };

  render() {
    const { children, tabs, rightElement } = this.props;
    const { active } = this.state;
    const getTabs: Array<string> =
      tabs ||
      React.Children.map(
        children,
        (child: any) => child && upperFirst(child.props.name)
      );

    return (
      <Flex>
        <Headbar>
          <Breadcrumbs collapsed>
            <CrumbTabs
              tabs={getTabs}
              activeTab={active}
              onChange={this.handleChange}
              local
            />
          </Breadcrumbs>
          {rightElement && <Pull right>{rightElement}</Pull>}
        </Headbar>
        <SimpleTabs activeTab={active}>
          {React.Children.map(
            children,
            child =>
              child && (
                <SimpleTab
                  key={child.props.name}
                  name={child.props.name.toLowerCase()}
                >
                  {child.props.children}
                </SimpleTab>
              )
          )}
        </SimpleTabs>
      </Flex>
    );
  }
}

export default Tabs;
export { Pane };
