// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Td, Th } from '../new_table';
import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core';
import { Link } from 'react-router';
import DetailButton from '../detail_button';

type NameColumnProps = {
  popoverContent?: React.Element<any>,
  name: string,
  link?: string,
  onDetailClick?: Function,
  isActive?: boolean,
  hasAlerts?: boolean,
};

type NameProps = {
  link?: string,
  name: string,
};

const Name: Function = ({ link, name }: NameProps): any =>
  link ? (
    <Link to={link} className="resource-name-link" title={name}>
      {name}
    </Link>
  ) : (
    <span>{name}</span>
  );

const NameColumn: Function = ({
  popoverContent,
  name,
  link,
  isActive,
  onDetailClick,
  hasAlerts,
}: NameColumnProps): React.Element<any> => (
  <Td className={`name ${hasAlerts ? 'table-name-has-alerts' : ''}`}>
    <div className="table-name-wrapper">
      <div className="table-name-popover-wrapper">
        {popoverContent ? (
          <Popover
            hoverOpenDelay={300}
            content={popoverContent}
            interactionKind={PopoverInteractionKind.HOVER}
            position={Position.TOP}
            rootElementTag="div"
            className="table-name-popover"
            useSmartPositioning
          >
            <Name {...{ name, link }} />
          </Popover>
        ) : (
          <div className="table-name-popover">
            <Name {...{ name, link }} />
          </div>
        )}
      </div>
      {onDetailClick && (
        <DetailButton active={isActive} onClick={onDetailClick} />
      )}
    </div>
  </Td>
);

type NameColumnHeaderProps = {
  name?: string,
  title?: string,
};

const NameColumnHeader: Function = ({
  name: name = 'name',
  title: title = 'Name',
  ...rest
}: NameColumnHeaderProps): React.Element<any> => (
  <Th className="name" name={name} {...rest}>
    {title}
  </Th>
);

export default compose(
  onlyUpdateForKeys(['link', 'name', 'popoverContent', 'isActive'])
)(NameColumn);

export { NameColumnHeader };
