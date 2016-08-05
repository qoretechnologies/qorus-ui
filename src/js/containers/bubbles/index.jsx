/* @flow */
import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';

import { BubbleList } from '../../components/bubbles';
import BubbleItem from './item';

const Bubbles = ({ bubbleList }: { bubbleList: Array<*> }) => (
  <BubbleList>
    <ReactCSSTransitionGroup
      transitionName="bubble"
      transitionEnterTimeout={500}
      transitionLeaveTimeout={300}
      component="div"
    >
      {bubbleList.map(
        item => (
          <BubbleItem
            key={`bubble_${item.id}`}
            bubble={item}
          />
        )
      )}
    </ReactCSSTransitionGroup>
  </BubbleList>
);

export default connect(
  state => ({
    bubbleList: state.ui.bubbles.list || [],
  })
)(Bubbles);
