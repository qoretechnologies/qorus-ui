/* @flow */
import React, { Component } from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import { ButtonGroup, Button, Intent } from '@blueprintjs/core';

import Toolbar from '../toolbar';
import { getControlChar } from '../../helpers/document';
import Icon from '../../components/icon';
import Flex from '../Flex';
import Pull from '../Pull';
import { injectIntl, FormattedMessage } from 'react-intl';

@pure(['messages', 'height'])
@injectIntl
export default class LogComponent extends Component {
  props: {
    messages: Array<string>,
    onClearClick: Function,
    height: any,
  } = this.props;

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
                text={this.props.intl.formatMessage({ id: 'button.autoscroll' })}
                icon={this.state.autoScroll ? 'selection' : 'circle'}
                intent={this.state.autoScroll ? Intent.PRIMARY : Intent.NONE}
                onClick={this.setAutoScroll}
              />
              <Button
                text={this.props.intl.formatMessage({ id: 'button.clear' })}
                icon="cross"
                onClick={onClearClick}
              />
            </ButtonGroup>
          </Pull>
          <Pull right>
            <Icon icon="info-circle" /><FormattedMessage id='component.use' />{' '}
            <strong>"{getControlChar()} + f"</strong>{' '}<FormattedMessage id='component.to-search-log' />
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
