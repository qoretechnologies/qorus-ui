/* @flow */
import React, { Component } from 'react';

import Toolbar from '../toolbar';
import Search from '../search';
import { Controls, Control as Button } from '../controls';

export default class LogComponent extends Component {
  props: {
    messages: Array<string>,
    onSearchChange: Function,
    onClearClick: Function,
    defaultSearchValue: string,
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
      defaultSearchValue,
      onSearchChange,
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
          <Search
            defaultValue={defaultSearchValue}
            onSearchUpdate={onSearchChange}
          />
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
