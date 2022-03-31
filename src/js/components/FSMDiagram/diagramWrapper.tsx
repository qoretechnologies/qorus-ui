import React from 'react';
import { ElementPan } from '../PanElement';

export interface IFSMDiagramWrapperProps {
  isHoldingShiftKey?: boolean;
  wrapperDimensions: { width: number; height: number };
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
  // @ts-ignore ts-migrate(2339) FIXME: Property 'items' does not exist on type 'PropsWith... Remove this comment to see the full error message
  items,
}) => {
  return (
    <ElementPan
      key={JSON.stringify(wrapperDimensions)}
      // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'number'.
      width="100%"
      // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'number'.
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
