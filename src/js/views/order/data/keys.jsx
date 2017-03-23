import React, { PropTypes } from 'react';
import TreeView from './tree';

export default function KeysView(props) {
  return (
    <TreeView
      data="keys"
      order={props.order}
    />
  );
}

KeysView.propTypes = {
  order: PropTypes.object,
};
