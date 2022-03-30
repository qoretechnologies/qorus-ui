/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import withHandlers from 'recompose/withHandlers';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import includes from 'lodash/includes';
import flatten from 'lodash/flatten';
import {
  Controls as ButtonGroup,
  Control as Button,
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
} from '../../../components/controls';
import Pull from '../../../components/Pull';
import { Tooltip } from '@blueprintjs/core';
import map from 'lodash/map';
import omit from 'lodash/omit';
import ContentByType from '../../../components/ContentByType';

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
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'mand' does not exist on type '{ x: strin... Remove this comment to see the full error message
  mand,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'type' does not exist on type '{ x: strin... Remove this comment to see the full error message
  type,
  isSelected,
  details,
  onCodeClick,
  onInfoClick,
}: {
  x: Number | string,
  y: Number | string,
  offsetX: number,
  width: Number | string,
  height: Number | string,
  background: string,
  textColor: string,
  children?: string,
  handleMouseOver?: Function,
  handleMouseOut?: Function,
  onClick?: Function,
  onCodeClick: Function,
  onInfoClick: Function,
  details: any,
  descShown: boolean,
  isSelected: boolean,
}) => (
  <svg
    // @ts-expect-error ts-migrate(2322) FIXME: Type 'string | Number' is not assignable to type '... Remove this comment to see the full error message
    x={x}
    // @ts-expect-error ts-migrate(2322) FIXME: Type 'string | Number' is not assignable to type '... Remove this comment to see the full error message
    y={y}
    // @ts-expect-error ts-migrate(2322) FIXME: Type 'string | Number' is not assignable to type '... Remove this comment to see the full error message
    height={height}
    // @ts-expect-error ts-migrate(2322) FIXME: Type 'string | Number' is not assignable to type '... Remove this comment to see the full error message
    width={width}
    // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message
    onMouseOver={handleMouseOver}
    // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message
    onMouseOut={handleMouseOut}
    // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message
    onClick={onClick}
    className="mapper-label"
  >
    // @ts-expect-error ts-migrate(2322) FIXME: Type 'string | Number' is not assignable to type '... Remove this comment to see the full error message
    <rect x="0" y="0" height={height} width={width} fill="#ffffff" />
    // @ts-expect-error ts-migrate(2322) FIXME: Type 'string | Number' is not assignable to type '... Remove this comment to see the full error message
    <foreignObject width={width} height={height}>
      <div
        style={{
          padding: 0,
          margin: 0,
          // @ts-expect-error ts-migrate(2322) FIXME: Type 'string | Number' is not assignable to type '... Remove this comment to see the full error message
          height,
          position: 'fixed',
          width: '100%',
          fontSize: '13px',
          lineHeight: `${height}px`,
          border: isSelected ? '2px solid #5c7080' : '2px solid #a9a9a9',
          borderRadius: '3px',
          backgroundImage:
            isSelected &&
            'linear-gradient(to right bottom, transparent, #5c7080)',
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
          // @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; content: Element; rootE... Remove this comment to see the full error message
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
                  <Button
                    icon="info-sign"
                    onClick={() => onInfoClick(details, 'info')}
                  />
                  {details.code && (
                    <Button
                      icon="code"
                      onClick={() => onCodeClick(details, 'code')}
                    />
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
    handleMouseOver: (props: Object): Function => (
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
      event: EventHandler
    ): void => {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'onMouseOver' does not exist on type 'Obj... Remove this comment to see the full error message
      props.onMouseOver();
    },
    handleMouseOut: (props: Object): Function => () => {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'onMouseOut' does not exist on type 'Obje... Remove this comment to see the full error message
      props.onMouseOut();
    },
  }),
  onlyUpdateForKeys(['isSelected'])
)(Label);
