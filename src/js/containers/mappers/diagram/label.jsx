/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import withHandlers from 'recompose/withHandlers';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import includes from 'lodash/includes';
import flatten from 'lodash/flatten';

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
  mand: boolean,
  type: string,
  descShown: boolean,
}) => (
  <svg
    ref="label"
    x={x}
    y={y}
    height={height}
    width={width}
    onMouseOver={handleMouseOver}
    onMouseOut={handleMouseOut}
    onClick={onClick}
    className="mapper-label"
  >
    <rect
      x="0"
      y="0"
      height={height}
      width={width}
      fill={background}
    />
    <text
      x={offsetX}
      y="15"
      fill={textColor}
      textAnchor="start"
      alignmentBaseline="middle"
    >
      {children}
    </text>
    { type && (
      <text
        x={offsetX + 30}
        y="33"
        fontSize="11"
        fill={textColor}
        textAnchor="start"
        alignmentBaseline="middle"
      >
        Type: {type}
      </text>
    )}
    { mand ? (
      <text
        x={offsetX}
        y="33"
        fontSize="11"
        fill="#fff"
        textAnchor="start"
        alignmentBaseline="middle"
        className="svg-icon"
      >
        &#xf058;
      </text>
    ) : (
      <text
        x={offsetX}
        y="33"
        fontSize="11"
        fill="#fff"
        textAnchor="start"
        alignmentBaseline="middle"
        className="svg-icon"
      >
        &#xf056;
      </text>
    )}
  </svg>
);

export default compose(
  mapProps(({ details, ...rest }) => ({
    mand: details.mand,
    type: details.type,
    desc: details.desc,
    ...rest,
  })),
  withHandlers({
    handleMouseOver: (props: Object): Function => (event: EventHandler): void => {
      event.persist();
      event.stopPropagation();

      const target = {
        input: null,
        output: [],
      };
      const { mand, type, desc, relations } = props;
      const { top, left, width } = event.target.parentNode.getBoundingClientRect();

      relations.forEach(r => {
        const entries = flatten(Object.entries(r));

        if (includes(entries, props.children)) {
          if (target.input !== entries[1]) {
            target.input = entries[1];
          }

          target.output.push(entries[0]);
        }
      });

      props.onMouseOver();
      props.toggleTooltip({
        mand,
        type,
        desc,
        target,
        position: {
          top,
          left,
          width,
        },
      });
    },
    handleMouseOut: (props: Object): Function => () => {
      props.onMouseOut();
      props.toggleTooltip(null);
    },
  }),
  onlyUpdateForKeys(
    ['x', 'y', 'offsetX', 'width', 'height', 'background', 'textColor', 'children']
  ),
)(Label);
