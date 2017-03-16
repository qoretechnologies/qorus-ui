// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

import ResizeHandle from '../resize/handle';
import Icon from '../icon';

type Props = {
  width?: number,
  onClose: Function,
  children: any,
  onResize?: Function,
};

const Pane: Function = ({ width, onClose, children, onResize }: Props) => (
  <div
    className="pane right"
    style={{ width }}
  >
    <button
      type="button"
      className="btn btn-xs btn-inverse pane__close"
      onClick={onClose}
    >
      <Icon icon="times-circle" /> Close
    </button>
    <div className="pane__content">
      {children}
    </div>
    <ResizeHandle
      onStop={onResize}
      left
      min={{ width: 400 }}
    />
  </div>
);

export default pure([
  'width',
  'children',
])(Pane);
