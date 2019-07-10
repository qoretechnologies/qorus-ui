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
  mand,
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
    x={x}
    y={y}
    height={height}
    width={width}
    onMouseOver={handleMouseOver}
    onMouseOut={handleMouseOut}
    onClick={onClick}
    className="mapper-label"
  >
    <rect x="0" y="0" height={height} width={width} fill="#ffffff" />
    <foreignObject width={width} height={height}>
      <div
        style={{
          padding: 0,
          margin: 0,
          height,
          position: 'relative',
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
      event: EventHandler
    ): void => {
      props.onMouseOver();
    },
    handleMouseOut: (props: Object): Function => () => {
      props.onMouseOut();
    },
  }),
  onlyUpdateForKeys(['isSelected'])
)(Label);
