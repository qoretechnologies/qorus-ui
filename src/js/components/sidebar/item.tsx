// @flow
import { Icon, Position, Tooltip } from '@blueprintjs/core';
import classnames from 'classnames';
import map from 'lodash/map';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import mapProps from 'recompose/mapProps';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import Button from '../../components/controls/control';
import ButtonGroup from '../../components/controls/controls';
import { isActiveMulti } from '../../helpers/router';
import withDispatch from '../../hocomponents/withDispatch';
import actions from '../../store/api/actions';

type SidebarItemProps = {
  itemData: any;
  isCollapsed: boolean;
  // @ts-ignore ts-migrate(2300) FIXME: Duplicate identifier 'isExpanded'.
  isExpanded: boolean;
  subItem: boolean;
  onExpandClick: Function;
  handleExpandClick: Function;
  // @ts-ignore ts-migrate(2300) FIXME: Duplicate identifier 'isExpanded'.
  isExpanded: boolean;
  isActive: boolean;
  location: any;
  tooltip: string;
  children: any;
  expandedSection: string;
  isHovered: boolean;
  handleMouseEnter: Function;
  handleMouseLeave: Function;
  handleFavoriteClick: Function;
  handleUnfavoriteClick: Function;
  favoriteItems: Array<Object>;
};

const SidebarItemTooltip: Function = ({
  isCollapsed,
  tooltip,
  children,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
SidebarItemProps) =>
  isCollapsed ? (
    <Tooltip content={tooltip} position={Position.RIGHT}>
      {children}
    </Tooltip>
  ) : (
    <React.Fragment>{children}</React.Fragment>
  );

let SidebarItem: Function = ({
  itemData,
  isCollapsed,
  subItem,
  onExpandClick,
  isExpanded,
  isActive,
  isHovered,
  handleMouseEnter,
  handleMouseLeave,
  handleFavoriteClick,
  handleUnfavoriteClick,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'SidebarIte... Remove this comment to see the full error message
  intl,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
SidebarItemProps) =>
  // @ts-ignore ts-migrate(2339) FIXME: Property 'link' does not exist on type 'Object'.
  itemData.link ? (
    // @ts-ignore ts-migrate(2339) FIXME: Property 'link' does not exist on type 'Object'.
    <Link to={itemData.link} className="sidebarLink">
      <SidebarItemTooltip
        isCollapsed={isCollapsed}
        // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
        tooltip={intl.formatMessage({ id: itemData.name })}
      >
        <div
          className={classnames('sidebarItem', {
            sidebarSubItem: subItem,
            active: isActive,
            // @ts-ignore ts-migrate(2339) FIXME: Property 'isFavorite' does not exist on type 'Obje... Remove this comment to see the full error message
            favorite: itemData.isFavorite,
          })}
          // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message
          onMouseEnter={handleMouseEnter}
          // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message
          onMouseLeave={handleMouseLeave}
        >
          {/* @ts-ignore ts-migrate(2339) FIXME: Property 'icon' does not exist on type 'Object'. */}
          <Icon icon={itemData.icon} />{' '}
          {/* @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'. */}
          {!isCollapsed && intl.formatMessage({ id: itemData.name })}
          {/* @ts-ignore ts-migrate(2339) FIXME: Property 'isFavorite' does not exist on type 'Obje... Remove this comment to see the full error message */}
          {(isHovered || itemData.isFavorite) && !isCollapsed && (
            <ButtonGroup className="bp3-minimal sidebarFavorite">
              {/* @ts-ignore ts-migrate(2339) FIXME: Property 'isFavorite' does not exist on type 'Obje... Remove this comment to see the full error message */}
              {itemData.isFavorite ? (
                <Tooltip content="Remove from favorites">
                  <Button btnStyle="success" icon="star" onClick={handleUnfavoriteClick} />
                </Tooltip>
              ) : (
                <Tooltip content="Add to favorites">
                  <Button btnStyle="warning" icon="star-empty" onClick={handleFavoriteClick} />
                </Tooltip>
              )}
            </ButtonGroup>
          )}
        </div>
      </SidebarItemTooltip>
    </Link>
  ) : (
    <SidebarItemTooltip
      isCollapsed={isCollapsed}
      // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
      tooltip={intl.formatMessage({ id: itemData.name })}
    >
      <div
        className={classnames('sidebarItem', {
          sidebarSubItem: subItem,
          active: isActive,
          submenuCategory: onExpandClick,
        })}
        // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message
        onClick={onExpandClick}
      >
        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'icon' does not exist on type 'Object'. */}
        <Icon icon={itemData.icon} />{' '}
        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'. */}
        {!isCollapsed && intl.formatMessage({ id: itemData.name })}
        {onExpandClick && (
          <Icon icon={isExpanded ? 'caret-up' : 'caret-down'} className="submenuExpand" />
        )}
      </div>
    </SidebarItemTooltip>
  );

SidebarItem = compose(
  withDispatch(),
  withState('isHovered', 'changeHovered', false),
  withHandlers({
    handleMouseEnter:
      ({ changeHovered }): Function =>
      (): void => {
        changeHovered(() => true);
      },
    handleMouseLeave:
      ({ changeHovered }): Function =>
      (): void => {
        changeHovered(() => false);
      },
    handleFavoriteClick:
      ({ itemData, dispatchAction }): Function =>
      (event: any): void => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'stopPropagation' does not exist on type ... Remove this comment to see the full error message
        event.stopPropagation();

        dispatchAction(
          // @ts-ignore ts-migrate(2339) FIXME: Property 'currentUser' does not exist on type '{}'... Remove this comment to see the full error message
          actions.currentUser.storeFavoriteMenuItem,
          itemData,
          false
        );
      },
    handleUnfavoriteClick:
      ({ itemData, dispatchAction }): Function =>
      (event: any): void => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'stopPropagation' does not exist on type ... Remove this comment to see the full error message
        event.stopPropagation();

        // @ts-ignore ts-migrate(2339) FIXME: Property 'currentUser' does not exist on type '{}'... Remove this comment to see the full error message
        dispatchAction(actions.currentUser.storeFavoriteMenuItem, itemData, true);
      },
  }),
  mapProps(
    ({ itemData, location, ...rest }: SidebarItemProps): SidebarItemProps => ({
      isActive: isActiveMulti(
        // @ts-ignore ts-migrate(2339) FIXME: Property 'activePaths' does not exist on type 'Obj... Remove this comment to see the full error message
        itemData.activePaths || [itemData.link],
        // @ts-ignore ts-migrate(2339) FIXME: Property 'pathname' does not exist on type 'Object... Remove this comment to see the full error message
        location.pathname
      ),
      location,
      itemData,
      ...rest,
    })
  ),
  injectIntl
)(SidebarItem);

const SidebarItemWrapper: Function = ({
  itemData,
  isCollapsed,
  isExpanded,
  handleExpandClick,
  location,
  favoriteItems,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
SidebarItemProps) => (
  <React.Fragment>
    <SidebarItem
      itemData={itemData}
      isCollapsed={isCollapsed}
      // @ts-ignore ts-migrate(2339) FIXME: Property 'submenu' does not exist on type 'Object'... Remove this comment to see the full error message
      onExpandClick={itemData.submenu && handleExpandClick}
      isExpanded={isExpanded}
      location={location}
      favoriteItems={favoriteItems}
    />
    {isExpanded &&
      // @ts-ignore ts-migrate(2339) FIXME: Property 'submenu' does not exist on type 'Object'... Remove this comment to see the full error message
      map(itemData.submenu, (subItemData: any, key: number) => (
        <SidebarItem
          itemData={subItemData}
          key={key}
          isCollapsed={isCollapsed}
          subItem
          location={location}
          favoriteItems={favoriteItems}
        />
      ))}
  </React.Fragment>
);

export default compose(
  lifecycle({
    componentDidMount() {
      const { itemData, location, onSectionToggle } = this.props;

      if (isActiveMulti(itemData.activePaths || [itemData.link], location.pathname)) {
        onSectionToggle(itemData.name);
      }
    },
  }),
  withHandlers({
    handleExpandClick:
      ({ onSectionToggle, itemData }): Function =>
      (): void => {
        onSectionToggle(itemData.name);
      },
  }),
  mapProps(
    ({ expandedSection, itemData, ...rest }: SidebarItemProps): SidebarItemProps => ({
      // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
      isExpanded: expandedSection === itemData.name,
      expandedSection,
      itemData,
      ...rest,
    })
  )
)(SidebarItemWrapper);
