import React, { PropTypes } from 'react';
import TreeView from './tree';

export default function DynamicView(props) {
  return (
    <TreeView
      data="dynamicdata"
      order={props.order}
    />
  );
}

DynamicView.propTypes = {
  order: PropTypes.object,
};
