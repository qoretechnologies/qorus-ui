/* @flow */
import { Button, ButtonGroup, Intent } from '@blueprintjs/core';
import { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { compose } from 'recompose';
import pure from 'recompose/onlyUpdateForKeys';
import Icon from '../../components/icon';
import { getControlChar } from '../../helpers/document';
import Flex from '../Flex';
import Pull from '../Pull';
import Toolbar from '../toolbar';

class LogComponent extends Component {
  props: {
    messages: Array<string>;
    onClearClick: Function;
    height: any;
  } = this.props;

  state: {
    autoScroll: boolean;
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

  scrollRef: Function = (el) => {
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
                // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ messages... Remove this comment to see the full error message
                text={this.props.intl.formatMessage({ id: 'button.autoscroll' })}
                icon={this.state.autoScroll ? 'selection' : 'circle'}
                intent={this.state.autoScroll ? Intent.PRIMARY : Intent.NONE}
                // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type '((event... Remove this comment to see the full error message
                onClick={this.setAutoScroll}
              />
              <Button
                // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ messages... Remove this comment to see the full error message
                text={this.props.intl.formatMessage({ id: 'button.clear' })}
                icon="cross"
                // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type '((event... Remove this comment to see the full error message
                onClick={onClearClick}
              />
            </ButtonGroup>
          </Pull>
          <Pull right>
            <Icon icon="info-circle" />
            <FormattedMessage id="component.use" /> <strong>"{getControlChar()} + f"</strong>{' '}
            <FormattedMessage id="component.to-search-log" />
          </Pull>
        </Toolbar>
        <Flex className="log-area" scrollY>
          <pre
            className="language-log"
            style={{
              height: `${height || 'auto'}`,
              flex: '1 1 auto',
            }}
            // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'LegacyR... Remove this comment to see the full error message
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

export default compose(pure(['messages', 'height']), injectIntl)(LogComponent);
