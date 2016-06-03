import React, { PropTypes } from 'react';
import TreeView from './tree';

export default function StaticView(props) {
  return (
    <TreeView
      data="staticdata"
      params={props.params}
    />
  );
}

StaticView.propTypes = {
  params: PropTypes.object,
};
