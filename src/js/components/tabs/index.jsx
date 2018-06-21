import React from 'react';
import { Tabs2, Tab2 } from '@blueprintjs/core';
import classNames from 'classnames';

import Container from '../container';
import Pane from './pane';

type Props = {
  children?: any,
  active?: string,
  id?: string,
  className: string,
  onChange: Function,
  vertical?: boolean,
  noContainer?: boolean,
  boxed?: boolean,
};

class Tabs extends React.Component {
  props: Props;
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
  };

  render() {
    const { children, id, className, vertical, noContainer } = this.props;
    const { active } = this.state;

    return (
      <Tabs2
        className={classNames(className, {
          ['boxed-tabs']: this.props.boxed,
        })}
        selectedTabId={active.toLowerCase()}
        id={id}
        onChange={this.handleChange}
        renderActiveTabPanelOnly
        vertical={vertical}
      >
        {React.Children.map(children, child => (
          <Tab2
            id={child.props.name.toLowerCase()}
            title={child.props.name}
            panel={
              noContainer ? (
                child.props.children
              ) : (
                <Container fill>{child.props.children}</Container>
              )
            }
          />
        ))}
      </Tabs2>
    );
  }
}

export default Tabs;
export { Pane };
