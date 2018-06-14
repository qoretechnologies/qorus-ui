/* @flow */
import React, { Component } from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import { ButtonGroup, Button, Intent } from '@blueprintjs/core';

import Toolbar from '../toolbar';
import { getControlChar } from '../../helpers/document';
import Icon from '../../components/icon';

@pure(['messages', 'height'])
export default class LogComponent extends Component {
  props: {
    messages: Array<string>,
    onClearClick: Function,
    height: any,
  };

  state: {
    autoScroll: boolean,
    height: any,
  } = {
    autoScroll: true,
    height: 0,
  };

  componentDidMount() {
    this.setScroll();

    window.addEventListener('resize', () => {
      this.recalculateHeight();
    });
  }

  componentWillReceiveProps() {
    this.setScroll();
    this.recalculateHeight();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () => {
      this.recalculateHeight();
    });
  }

  scroll: any = null;
  el: any;

  scrollRef: Function = el => {
    this.scroll = el;
    this.el = el;

    this.recalculateHeight();
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

  recalculateHeight: Function = () => {
    if (this.el) {
      const { top } = this.el.getBoundingClientRect();
      const winHeight = window.innerHeight;
      const height: number = winHeight - top - 60;

      this.setState({
        height,
      });
    }
  };

  render() {
    const { onClearClick, height, messages } = this.props;

    return (
      <div>
        <Toolbar>
          <div className="pull-left">
            <ButtonGroup>
              <Button
                text="Autoscroll"
                iconName={this.state.autoScroll ? 'selection' : 'circle'}
                intent={this.state.autoScroll && Intent.PRIMARY}
                onClick={this.setAutoScroll}
              />
              <Button text="Clear" iconName="cross" onClick={onClearClick} />
            </ButtonGroup>
          </div>
          <p className="pull-right log-search">
            <Icon icon="info-circle" /> Use{' '}
            <strong>"{getControlChar()} + f"</strong> to search the log
          </p>
        </Toolbar>
        <div className="log-area">
          <pre
            className="language-log"
            style={{
              height: `${height === 'auto' ? height : this.state.height}px`,
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
        </div>
      </div>
    );
  }
}
