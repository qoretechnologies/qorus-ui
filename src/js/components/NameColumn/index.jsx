// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Td, Th } from '../new_table';
import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core';
import { Link } from 'react-router';
import DetailButton from '../detail_button';
import Text from '../text';
import { Controls as ButtonGroup, Control as Button } from '../controls';
import InterfaceTag from '../InterfaceTag';
import Flex from '../Flex';

type NameColumnProps = {
  popoverContent?: React.Element<any>,
  name: string,
  link?: string,
  onDetailClick?: Function,
  isActive?: boolean,
  hasAlerts?: boolean,
  type?: string,
};

type NameProps = {
  link?: string,
  name: string,
  hasAlerts: boolean,
};

const Name: Function = ({ link, name, hasAlerts }: NameProps): any =>
  link ? (
    <Link to={link} className="resource-name-link" title={name}>
      {name}
    </Link>
  ) : (
    <Text text={name} hasAlerts={hasAlerts} />
  );

const NameColumn: Function = ({
  popoverContent,
  name,
  link,
  isActive,
  onDetailClick,
  hasAlerts,
  type,
}: NameColumnProps): React.Element<any> => (
  <Td className={`name ${hasAlerts ? 'table-name-has-alerts' : ''}`}>
    <Flex flexFlow="row">
      {onDetailClick && (
        <ButtonGroup>
          <DetailButton active={isActive} onClick={onDetailClick} />
        </ButtonGroup>
      )}
      <Flex flexFlow="row" style={{ marginRight: hasAlerts ? '3px' : 0 }}>
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
            {type ? (
              <InterfaceTag
                title={name}
                type={type}
                link={link}
                className={hasAlerts && 'has-alerts'}
              />
            ) : (
              <Name {...{ name, link, hasAlerts }} />
            )}
          </Popover>
        ) : (
          <Flex flexFlow="row">
            {type ? (
              <InterfaceTag
                title={name}
                type={type}
                link={link}
                className={hasAlerts && 'has-alerts'}
              />
            ) : (
              <Name {...{ name, link, hasAlerts }} />
            )}
          </Flex>
        )}
      </Flex>
      {hasAlerts && (
        <ButtonGroup>
          <Button iconName="error" btnStyle="danger" onClick={onDetailClick} />
        </ButtonGroup>
      )}
    </Flex>
  </Td>
);

type NameColumnHeaderProps = {
  name?: string,
  title?: string,
  icon?: string,
};

const NameColumnHeader: Function = ({
  name: name = 'name',
  title: title = 'Name',
  icon,
  ...rest
}: NameColumnHeaderProps): React.Element<any> => (
  <Th className="name" name={name} icon={icon} {...rest}>
    {title}
  </Th>
);

export default compose(
  onlyUpdateForKeys(['link', 'name', 'popoverContent', 'isActive'])
)(NameColumn);

export { NameColumnHeader };
