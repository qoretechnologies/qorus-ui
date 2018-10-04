/* @flow */
import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';

import { BubbleList } from '../../components/bubbles';
import BubbleItem from './item';

export const Bubbles = ({ bubbleList }: { bubbleList: Array<*> }) => {
  if (bubbleList.length === 0) {
    return null;
  }
  return (
    <div
      className="
        pt-toast-container pt-overlay pt-overlay-open pt-toast-container-top
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
