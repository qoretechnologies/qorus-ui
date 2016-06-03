import React, { PropTypes } from 'react';
import TreeView from './tree';

export default function DynamicView(props) {
  return (
    <TreeView
      data="dynamicdata"
      params={props.params}
    />
  );
}

DynamicView.propTypes = {
  params: PropTypes.object,
};
