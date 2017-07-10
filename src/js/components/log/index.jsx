/* @flow */
import React, { Component } from 'react';
import pure from 'recompose/onlyUpdateForKeys';

import Toolbar from '../toolbar';
import { Controls, Control as Button } from '../controls';
import { getControlChar } from '../../helpers/document';
import Icon from '../../components/icon';

@pure([
  'messages',
  'height',
])
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

  scrollRef: Function = (el) => {
    this.scroll = el;
  };

  setScroll: Function = () => {
    if (this.state.autoScroll && this.scroll) {
      setTimeout(() => {
        this.scroll.scrollTop = this.scroll.scrollHeight;
      }, 150);
    }
  };

  setAutoScroll: Function = () => {
    this.setState({
      autoScroll: !this.state.autoScroll,
    });
  };

  render() {
    const {
      onClearClick,
      height,
      messages,
    } = this.props;

    return (
      <div>
        <Toolbar>
          <div className="pull-left">
            <Controls noControls grouped>
              { this.state.autoScroll ? (
                <Button
                  label="Autoscroll"
                  icon="check"
                  btnStyle="success"
                  action={this.setAutoScroll}
                  big
                />
              ) : (
                <Button
                  label="Autoscroll"
                  btnStyle="default"
                  action={this.setAutoScroll}
                  big
                />
              )}
              <Button
                label="Clear"
                icon="times"
                btnStyle="default"
                action={onClearClick}
                big
              />
            </Controls>
          </div>
          <p className="pull-right log-search">
            <Icon icon="info-circle" />
            {' '}
            Use <strong>"{getControlChar()} + f"</strong> to search the log
          </p>
        </Toolbar>
        <div className="log-area">
        <pre
          className="language-log"
          style={{ height: `${height === 'auto' ? height : height - 90}px` }}
          ref={this.scrollRef}
        >
          <code className="language-log">
            { messages.map((m, key) => (
              <p className="log-message" key={key}>{ m }</p>
            ))}
          </code>
        </pre>
        </div>
      </div>
    );
  }
}
