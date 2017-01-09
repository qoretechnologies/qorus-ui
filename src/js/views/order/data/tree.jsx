import React from 'react';

import Tree from 'components/tree';
import Loader from 'components/loader';

const TreeView = ({ order, data }: { order: Object, data: string }) => {
  if (!order) return <Loader />;

  return (
    <Tree data={order[data]} />
  );
};

export default TreeView;
