/* @flow */
import { Tooltip } from '@blueprintjs/core';
import map from 'lodash/map';
import omit from 'lodash/omit';
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import ContentByType from '../../../components/ContentByType';
import { Control as Button, Controls as ButtonGroup } from '../../../components/controls';
import Pull from '../../../components/Pull';

const Label = ({
  x,
  y,
  offsetX,
  width,
  height,
  background,
  textColor,
  children,
  handleMouseOver,
  handleMouseOut,
  onClick,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'mand' does not exist on type '{ x: strin... Remove this comment to see the full error message
  mand,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type '{ x: strin... Remove this comment to see the full error message
  type,
  isSelected,
  details,
  onCodeClick,
  onInfoClick,
}: {
  x: Number | string;
  y: Number | string;
  offsetX: number;
  width: Number | string;
  height: Number | string;
  background: string;
  textColor: string;
  children?: string;
  handleMouseOver?: Function;
  handleMouseOut?: Function;
  onClick?: Function;
  onCodeClick: Function;
  onInfoClick: Function;
  details: any;
  descShown: boolean;
  isSelected: boolean;
}) => (
  <svg
    // @ts-ignore ts-migrate(2322) FIXME: Type 'string | Number' is not assignable to type '... Remove this comment to see the full error message
    x={x}
    // @ts-ignore ts-migrate(2322) FIXME: Type 'string | Number' is not assignable to type '... Remove this comment to see the full error message
    y={y}
    // @ts-ignore ts-migrate(2322) FIXME: Type 'string | Number' is not assignable to type '... Remove this comment to see the full error message
    height={height}
    // @ts-ignore ts-migrate(2322) FIXME: Type 'string | Number' is not assignable to type '... Remove this comment to see the full error message
    width={width}
    // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message
    onMouseOver={handleMouseOver}
    // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message
    onMouseOut={handleMouseOut}
    // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message
    onClick={onClick}
    className="mapper-label"
  >
    {/* @ts-expect-error ts-migrate(2322) FIXME: Type 'string | Number' is not assignable to type '... Remove this comment to see the full error message */}
    <rect x="0" y="0" height={height} width={width} fill="#ffffff" />
    {/* @ts-expect-error ts-migrate(2322) FIXME: Type 'string | Number' is not assignable to type '... Remove this comment to see the full error message */}
    <foreignObject width={width} height={height}>
      <div
        style={{
          padding: 0,
          margin: 0,
          // @ts-ignore ts-migrate(2322) FIXME: Type 'string | Number' is not assignable to type '... Remove this comment to see the full error message
          height,
          position: 'fixed',
          width: '100%',
          fontSize: '13px',
          lineHeight: `${height}px`,
          border: isSelected ? '2px solid #5c7080' : '2px solid #a9a9a9',
          borderRadius: '3px',
          backgroundImage: isSelected && 'linear-gradient(to right bottom, transparent, #5c7080)',
        }}
      >
        <Tooltip
          content={
            <div>
              {map(omit(details, 'code'), (detailData, key) => (
                <p>
                  <strong>{key}</strong>: <ContentByType content={detailData} />
                </p>
              ))}
            </div>
          }
          // @ts-ignore ts-migrate(2322) FIXME: Type '{ children: Element; content: Element; rootE... Remove this comment to see the full error message
          rootElementTag="div"
          className="mapperTooltip"
        >
          <div style={{ width: '100%', height: '100%' }}>
            <div
              style={{
                position: 'absolute',
                height: '30px',
                lineHeight: '30px',
                left: 0,
                right: 0,
                padding: '0 3px',
              }}
            >
              <Pull right>
                <ButtonGroup>
                  <Button icon="info-sign" onClick={() => onInfoClick(details, 'info')} />
                  {details.code && (
                    <Button icon="code" onClick={() => onCodeClick(details, 'code')} />
                  )}
                </ButtonGroup>
              </Pull>
            </div>
            {children}
          </div>
        </Tooltip>
      </div>
    </foreignObject>
  </svg>
);

export default compose(
  withHandlers({
    handleMouseOver:
      (props: Object): Function =>
      (
        // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
        event: EventHandler
      ): void => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'onMouseOver' does not exist on type 'Obj... Remove this comment to see the full error message
        props.onMouseOver();
      },
    handleMouseOut:
      (props: Object): Function =>
      () => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'onMouseOut' does not exist on type 'Obje... Remove this comment to see the full error message
        props.onMouseOut();
      },
  }),
  onlyUpdateForKeys(['isSelected'])
)(Label);
