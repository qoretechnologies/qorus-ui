import React, { PropTypes } from 'react';
import TreeView from './tree';

export default function StaticView(props) {
  return (
    <TreeView
      data="staticdata"
      order={props.order}
    />
  );
}

StaticView.propTypes = {
  order: PropTypes.object,
};