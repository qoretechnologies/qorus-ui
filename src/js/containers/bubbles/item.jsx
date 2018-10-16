/* @flow */
import React from 'react';
import { connect } from 'react-redux';

import { bubbles } from '../../store/ui/actions';
import { Bubble } from '../../components/bubbles';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

const timeoutByBubbleType = {
  WARNING: '60000',
  DANGER: '6000',
  SUCCESS: '3000',
  INFO: '5000',
};

export class BubbleItem extends React.Component {
  props: {
    bubble: Object,
    deleteBubble: Function,
    timeout: number,
  };

  componentDidMount() {
    const { timeout, bubble } = this.props;
    const timeoutByType = timeout || timeoutByBubbleType[bubble.type];

    if (bubble.type !== 'WARNING') {
      setTimeout(this.delete, timeoutByType);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.bubble.type !== nextProps.bubble.type &&
      this.props.bubble.type === 'WARNING'
    ) {
      const timeoutByType =
        nextProps.timeout || timeoutByBubbleType[nextProps.bubble.type];

      setTimeout(this.delete, timeoutByType);
    }
  }

  delete = () => {
    const { bubble, deleteBubble } = this.props;
    deleteBubble(bubble.id);
  };

  render() {
    const { bubble: item } = this.props;
    return (
      <Bubble onClick={this.delete} type={item.type.toLowerCase()}>
        {item.message}
      </Bubble>
    );
  }
}

export default compose(
  connect(
    null,
    bubbles
  ),
  onlyUpdateForKeys(['bubble', 'timeout'])
)(BubbleItem);
