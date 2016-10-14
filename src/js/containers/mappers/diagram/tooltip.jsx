/* @flow */
import React from 'react';

import Autocomponent from '../../../components/autocomponent';

type Props = {
  data: Object,
}

const Tooltip: Function = ({ data }: Props): ?React.Element<any> => {
  if (!data) return null;

  const { mand, type, desc, target, position } = data;

  return (
    <div
      className="svg-tooltip"
      style={{
        left: position.left - ((300 - position.width) / 2),
        top: position.top + 60,
      }}
    >
      <div className="svg-tooltip-arrow" />
      <p>
        <span> Mandatory </span>: <Autocomponent>{ mand || false }</Autocomponent>
      </p>
      <p>
        <span> Type </span>: { type ? (<code>{ type }</code>) : '-' }
      </p>
      <p>
        <span> Relation </span>:
        {' '}
        { target.input ? `${target.input} -> ${target.output.join(', ')}` : '-' }
      </p>
      <p>
        <span> Description </span>: { desc || '-' }
      </p>
    </div>
  );
};

export default Tooltip;
