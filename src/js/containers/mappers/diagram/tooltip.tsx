/* @flow */
import React from 'react';
import ContentByType from '../../../components/ContentByType';

type Props = {
  data: any;
};

// @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
const Tooltip: Function = ({ data }: Props) => {
  if (!data) return null;

  // @ts-ignore ts-migrate(2339) FIXME: Property 'mand' does not exist on type 'Object'.
  const { mand, type, desc, target, position } = data;

  return (
    <div
      className="svg-tooltip"
      style={{
        left: position.left - (300 - position.width) / 2,
        top: position.top + 60,
      }}
    >
      <div className="svg-tooltip-arrow" />
      <p>
        <span> Mandatory </span>: <ContentByType content={mand || false} />
      </p>
      <p>
        <span> Type </span>: {type ? <code>{type}</code> : '-'}
      </p>
      <p>
        <span> Relation </span>:{' '}
        {target.input ? `${target.input} -> ${target.output.join(', ')}` : '-'}
      </p>
      <p>
        <span> Description </span>: {desc || '-'}
      </p>
    </div>
  );
};

export default Tooltip;
