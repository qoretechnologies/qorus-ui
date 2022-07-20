// @flow
import React from 'react';

// @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
const Preloader: Function = () => (
  <div className="center-wrapper default-wrapper">
    <svg className="preloader" width="40" height="40" viewBox="0 0 40 40">
      <polygon points="0 0 0 40 40 40 40 0" className="preloader-rect" />
      <text className="preloader-text" y="25" x="14">
        {' '}
        Q{' '}
      </text>
    </svg>
    <h3 className="main-loading-text"> Now loading... </h3>
  </div>
);

export default Preloader;
