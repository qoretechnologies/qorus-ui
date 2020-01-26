import React, { FC } from 'react';
import { StyledMapperField } from '.';

export interface IMapperInputProps {
  id: number;
  types: string[];
  name: string;
  isChild: boolean;
  level: number;
  lastChildIndex: number;
  onClick: any;
  type: any;
  field: any;
  isCustom: boolean;
  path: string;
  hasAvailableOutput: boolean;
}

const MapperInput: FC<IMapperInputProps> = ({
  id,
  field,
  types,
  name,
  isChild,
  level,
  isCustom,
  lastChildIndex,
  onClick,
  type,
  path,
  hasAvailableOutput,
}) => {
  return (
    <StyledMapperField
      input
      isChild={isChild}
      level={level}
      childrenCount={lastChildIndex}
      title={field.desc}
    >
      <h4>{name}</h4>
      <p
        className={types
          .join(' ')
          .replace(/</g, '')
          .replace(/>/g, '')}
      >
        {types.join(',')}
      </p>
    </StyledMapperField>
  );
};

export default MapperInput;
