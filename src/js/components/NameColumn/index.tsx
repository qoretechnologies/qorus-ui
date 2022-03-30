// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Td, Th } from '../new_table';
import {
  Popover,
  PopoverInteractionKind,
  Position,
  Tooltip,
} from '@blueprintjs/core';
import { Link } from 'react-router';
import DetailButton from '../detail_button';
import Text from '../text';
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Controls as ButtonGroup, Control as Button } from '../controls';
import InterfaceTag from '../InterfaceTag';
import Flex from '../Flex';
import { injectIntl } from 'react-intl';

type NameColumnProps = {
  // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  popoverContent?: React.Element<any>,
  name: string,
  link?: string,
  onDetailClick?: Function,
  isActive?: boolean,
  hasAlerts?: boolean,
  type?: string,
  className?: string,
};

type NameProps = {
  link?: string,
  name: string,
  hasAlerts: boolean,
};

const Name: Function = ({ link, name, hasAlerts }: NameProps): any =>
  link ? (
    <Link
      to={link}
      title={name}
      className="resource-name-link"
      // @ts-expect-error ts-migrate(17001) FIXME: JSX elements cannot have multiple attributes with ... Remove this comment to see the full error message
      title={name}
      onClick={e => e.stopPropagation()}
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
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'minimalAlert' does not exist on type 'Na... Remove this comment to see the full error message
  minimalAlert,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'alertTooltip' does not exist on type 'Na... Remove this comment to see the full error message
  alertTooltip,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'NameColumn... Remove this comment to see the full error message
  intl,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: NameColumnProps): React.Element<any> => (
  <Td
    className={`name ${hasAlerts ? 'table-name-has-alerts' : ''} ${className}`}
  >
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
            // @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; hoverOpenDelay: number;... Remove this comment to see the full error message
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
  name?: string,
  title?: string,
  icon?: string,
};

const NameColumnHeader: Function = ({
  name = 'name',
  title,
  icon = 'application',
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'NameColumn... Remove this comment to see the full error message
  intl,
  ...rest
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: NameColumnHeaderProps): React.Element<any> => (
  <Th
    className="name"
    name={name}
    icon={icon}
    {...rest}
  >
    {title || intl.formatMessage({ id: 'table.name' })}
  </Th>
);

export default compose(
  onlyUpdateForKeys([
    'link',
    'name',
    'popoverContent',
    'isActive',
    'hasAlerts',
    'className',
  ]),
  injectIntl
)(NameColumn);

const NCH = injectIntl(NameColumnHeader);
export { NCH as NameColumnHeader };
