/* @flow */
import React from 'react';
import { connect } from 'react-redux';

import BubbleItem from './item';

export const Bubbles = ({ bubbleList }: { bubbleList: Array<*> }) => {
  if (bubbleList.length === 0) {
    return null;
  }
  return (
    <div
      className="
        bp3-toast-container bp3-overlay bp3-overlay-open bp3-toast-container-top
      "
    >
      <span>
        {bubbleList.map(item => (
          <BubbleItem key={`bubble_${item.id}`} bubble={item} />
        ))}
      </span>
    </div>
  );
};

export default connect(state => ({
  bubbleList: state.ui.bubbles.list || [],
}))(Bubbles);
