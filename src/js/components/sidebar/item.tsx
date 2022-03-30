// @flow
import React from 'react';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import { Icon, Tooltip, Position } from '@blueprintjs/core';
import { Link } from 'react-router';
import map from 'lodash/map';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import mapProps from 'recompose/mapProps';
import { isActiveMulti } from '../../helpers/router';
import Button from '../../components/controls/control';
import ButtonGroup from '../../components/controls/controls';
import withDispatch from '../../hocomponents/withDispatch';
import actions from '../../store/api/actions';
import classnames from 'classnames';
import showIfPassed from '../../hocomponents/show-if-passed';
import { injectIntl } from 'react-intl';

type SidebarItemProps = {
  itemData: Object,
  isCollapsed: boolean,
  // @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'isExpanded'.
  isExpanded: boolean,
  subItem: boolean,
  onExpandClick: Function,
  handleExpandClick: Function,
  // @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'isExpanded'.
  isExpanded: boolean,
  isActive: boolean,
  location: Object,
  tooltip: string,
  children: any,
  expandedSection: string,
  isHovered: boolean,
  handleMouseEnter: Function,
  handleMouseLeave: Function,
  handleFavoriteClick: Function,
  handleUnfavoriteClick: Function,
  favoriteItems: Array<Object>,
};

const SidebarItemTooltip: Function = ({
  isCollapsed,
  tooltip,
  children,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: SidebarItemProps): React.Element<any> =>
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
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'SidebarIte... Remove this comment to see the full error message
  intl,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: SidebarItemProps): React.Element<any> =>
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'link' does not exist on type 'Object'.
  itemData.link ? (
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'link' does not exist on type 'Object'.
    <Link to={itemData.link} className="sidebarLink">
      <SidebarItemTooltip
        isCollapsed={isCollapsed}
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
        tooltip={intl.formatMessage({ id: itemData.name })}
      >
        <div
          className={classnames('sidebarItem', {
            sidebarSubItem: subItem,
            active: isActive,
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'isFavorite' does not exist on type 'Obje... Remove this comment to see the full error message
            favorite: itemData.isFavorite,
          })}
          // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message
          onMouseEnter={handleMouseEnter}
          // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message
          onMouseLeave={handleMouseLeave}
        >
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'icon' does not exist on type 'Object'.
          <Icon icon={itemData.icon} />{' '}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
          {!isCollapsed && intl.formatMessage({ id: itemData.name })}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'isFavorite' does not exist on type 'Obje... Remove this comment to see the full error message
          {(isHovered || itemData.isFavorite) && !isCollapsed && (
            <ButtonGroup className="bp3-minimal sidebarFavorite">
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'isFavorite' does not exist on type 'Obje... Remove this comment to see the full error message
              {itemData.isFavorite ? (
                <Tooltip content="Remove from favorites">
                  <Button
                    btnStyle="success"
                    icon="star"
                    onClick={handleUnfavoriteClick}
                  />
                </Tooltip>
              ) : (
                <Tooltip content="Add to favorites">
                  <Button
                    btnStyle="warning"
                    icon="star-empty"
                    onClick={handleFavoriteClick}
                  />
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
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
      tooltip={intl.formatMessage({ id: itemData.name })}
    >
      <div
        className={classnames('sidebarItem', {
          sidebarSubItem: subItem,
          active: isActive,
          submenuCategory: onExpandClick,
        })}
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message
        onClick={onExpandClick}
      >
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'icon' does not exist on type 'Object'.
        <Icon icon={itemData.icon} />{' '}
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
        {!isCollapsed && intl.formatMessage({ id: itemData.name })}
        {onExpandClick && (
          <Icon
            icon={isExpanded ? 'caret-up' : 'caret-down'}
            className="submenuExpand"
          />
        )}
      </div>
    </SidebarItemTooltip>
  );

SidebarItem = compose(
  withDispatch(),
  withState('isHovered', 'changeHovered', false),
  withHandlers({
    handleMouseEnter: ({ changeHovered }): Function => (): void => {
      changeHovered(() => true);
    },
    handleMouseLeave: ({ changeHovered }): Function => (): void => {
      changeHovered(() => false);
    },
    handleFavoriteClick: ({ itemData, dispatchAction }): Function => (
      event: Object
    ): void => {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'stopPropagation' does not exist on type ... Remove this comment to see the full error message
      event.stopPropagation();

      dispatchAction(
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'currentUser' does not exist on type '{}'... Remove this comment to see the full error message
        actions.currentUser.storeFavoriteMenuItem,
        itemData,
        false
      );
    },
    handleUnfavoriteClick: ({ itemData, dispatchAction }): Function => (
      event: Object
    ): void => {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'stopPropagation' does not exist on type ... Remove this comment to see the full error message
      event.stopPropagation();

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'currentUser' does not exist on type '{}'... Remove this comment to see the full error message
      dispatchAction(actions.currentUser.storeFavoriteMenuItem, itemData, true);
    },
  }),
  mapProps(
    ({ itemData, location, ...rest }: SidebarItemProps): SidebarItemProps => ({
      isActive: isActiveMulti(
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'activePaths' does not exist on type 'Obj... Remove this comment to see the full error message
        itemData.activePaths || [itemData.link],
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'pathname' does not exist on type 'Object... Remove this comment to see the full error message
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
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: SidebarItemProps): React.Element<any> => (
  <React.Fragment>
    <SidebarItem
      itemData={itemData}
      isCollapsed={isCollapsed}
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'submenu' does not exist on type 'Object'... Remove this comment to see the full error message
      onExpandClick={itemData.submenu && handleExpandClick}
      isExpanded={isExpanded}
      location={location}
      favoriteItems={favoriteItems}
    />
    {isExpanded &&
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'submenu' does not exist on type 'Object'... Remove this comment to see the full error message
      map(itemData.submenu, (subItemData: Object, key: number) => (
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

      if (
        isActiveMulti(
          itemData.activePaths || [itemData.link],
          location.pathname
        )
      ) {
        onSectionToggle(itemData.name);
      }
    },
  }),
  withHandlers({
    handleExpandClick: ({
      onSectionToggle,
      itemData,
    }): Function => (): void => {
      onSectionToggle(itemData.name);
    },
  }),
  mapProps(
    ({
      expandedSection,
      itemData,
      ...rest
    }: SidebarItemProps): SidebarItemProps => ({
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
      isExpanded: expandedSection === itemData.name,
      expandedSection,
      itemData,
      ...rest,
    })
  )
)(SidebarItemWrapper);
