import { Button, Tooltip } from '@blueprintjs/core';
import { FC } from 'react';
import { StyledMapperField } from '.';

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
  // @ts-ignore ts-migrate(2339) FIXME: Property 't' does not exist on type 'PropsWithChil... Remove this comment to see the full error message
  t,
}) => {
  return (
    <StyledMapperField
      title={field.desc}
      isChild={isChild}
      level={level}
      childrenCount={lastChildIndex}
      style={{
        backgroundColor: hasRelation ? '#57801a85' : '#fff',
      }}
    >
      <h4>{name}</h4>
      <p className={`${type.types_returned.join(' ').replace(/</g, '').replace(/>/g, '')} type`}>
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
