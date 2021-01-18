import React from 'react';
import { ElementPan } from '../PanElement';

export interface IFSMDiagramWrapperProps {
  isHoldingShiftKey?: boolean;
  wrapperDimensions: { width: number, height: number };
  setPan: (x: number, y: number) => void;
  children: any;
  zoom: number;
}

const FSMDiagramWrapper: React.FC<IFSMDiagramWrapperProps> = ({
  isHoldingShiftKey,
  wrapperDimensions,
  children,
  setPan,
  zoom,
  items,
}) => {
  return (
    <ElementPan
      key={JSON.stringify(wrapperDimensions)}
      width="100%"
      height="100%"
      startX={0}
      startY={0}
      onPan={({ x, y }) => setPan(x, y)}
      enableDragging={isHoldingShiftKey}
      zoom={zoom}
      items={items}
    >
      {children}
    </ElementPan>
  );
};

export default FSMDiagramWrapper;
