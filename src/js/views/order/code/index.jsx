import React from 'react';

import Code from 'components/code';

const LibraryView = ({ workflow }: { workflow: Object }) => {
  const getHeight: Function = (): number => {
    const navbar = document.querySelector('.navbar').clientHeight;
    const header = document.querySelector('.order-header').clientHeight;
    const tabs = document.querySelector('#content-wrapper .nav-tabs').clientHeight;
    const footer = document.querySelector('footer').clientHeight;
    const top = navbar + header + tabs + footer + 40;

    return window.innerHeight - top;
  };

  return (
    <div className="workflow-detail-tabs">
      <Code
        data={workflow.lib}
        heightUpdater={getHeight}
      />
    </div>
  );
};

export default LibraryView;
