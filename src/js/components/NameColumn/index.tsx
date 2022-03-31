// @flow
import { Popover, PopoverInteractionKind, Position, Tooltip } from '@blueprintjs/core';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Control as Button, Controls as ButtonGroup } from '../controls';
import DetailButton from '../detail_button';
import Flex from '../Flex';
import InterfaceTag from '../InterfaceTag';
import { Td, Th } from '../new_table';
import Text from '../text';

type NameColumnProps = {
  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  popoverContent?;
  name: string;
  link?: string;
  onDetailClick?: Function;
  isActive?: boolean;
  hasAlerts?: boolean;
  type?: string;
  className?: string;
};

type NameProps = {
  link?: string;
  name: string;
  hasAlerts: boolean;
};

const Name: Function = ({ link, name, hasAlerts }: NameProps): any =>
  link ? (
    <Link
      to={link}
      title={name}
      className="resource-name-link"
      // @ts-ignore ts-migrate(17001) FIXME: JSX elements cannot have multiple attributes with ... Remove this comment to see the full error message
      title={name}
      onClick={(e) => e.stopPropagation()}
    >
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
  className,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'minimalAlert' does not exist on type 'Na... Remove this comment to see the full error message
  minimalAlert,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'alertTooltip' does not exist on type 'Na... Remove this comment to see the full error message
  alertTooltip,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'NameColumn... Remove this comment to see the full error message
  intl,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
NameColumnProps) => (
  <Td className={`name ${hasAlerts ? 'table-name-has-alerts' : ''} ${className}`}>
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
            // @ts-ignore ts-migrate(2322) FIXME: Type '{ children: Element; hoverOpenDelay: number;... Remove this comment to see the full error message
            rootElementTag="div"
            className="table-name-popover"
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
        <ButtonGroup minimal={minimalAlert}>
          <Tooltip content={alertTooltip || intl.formatMessage({ id: 'button.view-alerts' })}>
            <Button
              icon="error"
              title={intl.formatMessage({ id: 'button.item-has-alerts' })}
              btnStyle="danger"
              onClick={onDetailClick}
            />
          </Tooltip>
        </ButtonGroup>
      )}
    </Flex>
  </Td>
);

type NameColumnHeaderProps = {
  name?: string;
  title?: string;
  icon?: string;
};

const NameColumnHeader: Function = ({
  name = 'name',
  title,
  icon = 'application',
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'NameColumn... Remove this comment to see the full error message
  intl,
  ...rest
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
NameColumnHeaderProps) => (
  <Th className="name" name={name} icon={icon} {...rest}>
    {title || intl.formatMessage({ id: 'table.name' })}
  </Th>
);

export default compose(
  onlyUpdateForKeys(['link', 'name', 'popoverContent', 'isActive', 'hasAlerts', 'className']),
  injectIntl
)(NameColumn);

const NCH = injectIntl(NameColumnHeader);
export { NCH as NameColumnHeader };
