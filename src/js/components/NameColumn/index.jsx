// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Td } from '../new_table';
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
    <Link to={link} className="resource-name-link">
      {name}
    </Link>
  ) : (
    name
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
          <Name {...{ name, link }} />
        )}
      </div>
      {onDetailClick && (
        <DetailButton active={isActive} onClick={onDetailClick} />
      )}
    </div>
  </Td>
);

export default compose(
  onlyUpdateForKeys(['link', 'name', 'popoverContent', 'isActive'])
)(NameColumn);
