/* @flow */
import React from 'react';
import { connect } from 'react-redux';

import { bubbles } from '../../store/ui/actions';
import { Bubble } from '../../components/bubbles';

export class BubbleItem extends React.Component {
  props: {
    bubble: Object,
    deleteBubble: Function,
    timeout: number
  }

  componentDidMount() {
    const { timeout = 5000 } = this.props;
    setTimeout(this.delete, timeout);
  }

  delete = () => {
    const { bubble, deleteBubble } = this.props;
    deleteBubble(bubble.id);
  }

  render() {
    const { bubble: item } = this.props;
    return (
      <Bubble
        onClick={this.delete}
        type={item.type.toLowerCase()}
      >
        {item.message}
      </Bubble>
    );
  }
}

export default connect(
  () => ({}),
  bubbles
)(BubbleItem);
