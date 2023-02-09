/* @flow */
import { ReqoreNotificationsWrapper } from '@qoretechnologies/reqore';
import { connect } from 'react-redux';
import BubbleItem from './item';

// @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
export const Bubbles = ({ bubbleList }: { bubbleList: Array<any> }) => {
  if (bubbleList.length === 0) {
    return null;
  }
  return (
    <ReqoreNotificationsWrapper position="TOP">
      {bubbleList.map((item) => (
        <BubbleItem key={`bubble_${item.id}`} bubble={item} />
      ))}
    </ReqoreNotificationsWrapper>
  );
};

export default connect((state) => ({
  bubbleList: state.ui.bubbles.list || [],
}))(Bubbles);
