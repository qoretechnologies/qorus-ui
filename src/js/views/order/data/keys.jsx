import React, { PropTypes } from 'react';
import TreeView from './tree';

export default function KeysView(props) {
  return (
    <TreeView
      data="keys"
      params={props.params}
    />
  );
}

KeysView.propTypes = {
  params: PropTypes.object,
};
