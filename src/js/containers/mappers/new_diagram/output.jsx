import React, { FC } from 'react';
import { StyledMapperField } from '.';
import { Button, Tooltip } from '@blueprintjs/core';

export interface IMapperOutputProps {
  onDrop: (inputPath: string, outputPath: string) => any;
  id: number;
  accepts: string[];
  name: string;
  isChild: boolean;
  level: number;
  onClick: any;
  onManageClick: any;
  lastChildIndex: number;
  type: any;
  field: any;
  isCustom: boolean;
  path: string;
  hasRelation: boolean;
}

const MapperOutput: FC<IMapperOutputProps> = ({
  onDrop,
  id,
  accepts,
  name,
  isChild,
  level,
  onClick,
  onManageClick,
  lastChildIndex,
  type,
  field,
  isCustom,
  path,
  hasRelation,
  t,
}) => {
  return (
    <StyledMapperField
      title={field.desc}
      isChild={isChild}
      level={level}
      childrenCount={lastChildIndex}
      style={{
        backgroundColor: hasRelation ? '#c9f5d4' : '#fff',
      }}
    >
      <h4>{name}</h4>
      <p
        className={type.types_returned
          .join(' ')
          .replace(/</g, '')
          .replace(/>/g, '')}
      >
        {type.types_returned.join(',')}
      </p>
      <Tooltip content={'ManageMapperFieldOptions'} position="right">
        <Button
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            left: '8px',
            minWidth: '18px',
            minHeight: '18px',
          }}
          icon="code"
          minimal
          small
          intent={hasRelation ? 'success' : 'none'}
          onClick={onManageClick}
        />
      </Tooltip>
    </StyledMapperField>
  );
};

export default MapperOutput;
