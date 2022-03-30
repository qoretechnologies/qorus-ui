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
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'isWholeInput' does not exist on type 'Pr... Remove this comment to see the full error message
  isWholeInput,
}) => {
  return (
    <StyledMapperField
      input
      isInputHash={isWholeInput}
      isChild={isChild}
      level={level}
      childrenCount={lastChildIndex}
      title={field?.desc}
      onClick={onClick}
    >
      <h4 style={{ fontSize: isWholeInput ? '16px' : '14px' }}>{name}</h4>
      {!isWholeInput && (
        <p
          className={`${types
            .join(' ')
            .replace(/</g, '')
            .replace(/>/g, '')} type`}
        >
          {`${types.includes('nothing') ? '*' : ''}${type.base_type}`}
        </p>
      )}
    </StyledMapperField>
  );
};

export default MapperInput;
