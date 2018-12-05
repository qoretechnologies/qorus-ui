/* @flow */
import React, { Component } from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import { ButtonGroup, Button, Intent } from '@blueprintjs/core';

import Toolbar from '../toolbar';
import { getControlChar } from '../../helpers/document';
import Icon from '../../components/icon';
import Flex from '../Flex';
import Pull from '../Pull';

@pure(['messages', 'height'])
export default class LogComponent extends Component {
  props: {
    messages: Array<string>,
    onClearClick: Function,
    height: any,
  };

  state: {
    autoScroll: boolean,
  } = {
    autoScroll: true,
  };

  componentDidMount() {
    this.setScroll();
  }

  componentWillReceiveProps() {
    this.setScroll();
  }

  scroll: any = null;
  el: any;

  scrollRef: Function = el => {
    this.scroll = el;
    this.el = el;
  };

  setScroll: Function = () => {
    if (this.state.autoScroll && this.scroll) {
      setTimeout(() => {
        if (this.scroll) {
          this.scroll.scrollTop = this.scroll.scrollHeight;
        }
      }, 150);
    }
  };

  setAutoScroll: Function = () => {
    this.setState({
      autoScroll: !this.state.autoScroll,
    });
  };

  render() {
    const { onClearClick, height, messages } = this.props;

    return (
      <Flex>
        <Toolbar mb>
          <Pull>
            <ButtonGroup>
              <Button
                text="Autoscroll"
                iconName={this.state.autoScroll ? 'selection' : 'circle'}
                intent={this.state.autoScroll ? Intent.PRIMARY : Intent.NONE}
                onClick={this.setAutoScroll}
              />
              <Button text="Clear" iconName="cross" onClick={onClearClick} />
            </ButtonGroup>
          </Pull>
          <Pull right>
            <Icon iconName="info-circle" /> Use{' '}
            <strong>"{getControlChar()} + f"</strong> to search the log
          </Pull>
        </Toolbar>
        <Flex className="log-area" scrollY>
          <pre
            className="language-log"
            style={{
              height: `${height || 'auto'}`,
            }}
            ref={this.scrollRef}
          >
            <code className="language-log">
              {messages.map((m, key) => (
                <p className="log-message" key={key}>
                  {m}
                </p>
              ))}
            </code>
          </pre>
        </Flex>
      </Flex>
    );
  }
}
