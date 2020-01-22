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
  isExpanded: boolean,
  subItem: boolean,
  onExpandClick: Function,
  handleExpandClick: Function,
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
  intl,
}: SidebarItemProps): React.Element<any> =>
  itemData.link ? (
    <Link to={itemData.link} className="sidebarLink">
      <SidebarItemTooltip
        isCollapsed={isCollapsed}
        tooltip={intl.formatMessage({ id: itemData.name })}
      >
        <div
          className={classnames('sidebarItem', {
            sidebarSubItem: subItem,
            active: isActive,
            favorite: itemData.isFavorite,
          })}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Icon icon={itemData.icon} />{' '}
          {!isCollapsed && intl.formatMessage({ id: itemData.name })}
          {(isHovered || itemData.isFavorite) && !isCollapsed && (
            <ButtonGroup className="bp3-minimal sidebarFavorite">
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
      tooltip={intl.formatMessage({ id: itemData.name })}
    >
      <div
        className={classnames('sidebarItem', {
          sidebarSubItem: subItem,
          active: isActive,
          submenuCategory: onExpandClick,
        })}
        onClick={onExpandClick}
      >
        <Icon icon={itemData.icon} />{' '}
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
      event.stopPropagation();

      dispatchAction(
        actions.currentUser.storeFavoriteMenuItem,
        itemData,
        false
      );
    },
    handleUnfavoriteClick: ({ itemData, dispatchAction }): Function => (
      event: Object
    ): void => {
      event.stopPropagation();

      dispatchAction(actions.currentUser.storeFavoriteMenuItem, itemData, true);
    },
  }),
  mapProps(
    ({ itemData, location, ...rest }: SidebarItemProps): SidebarItemProps => ({
      isActive: isActiveMulti(
        itemData.activePaths || [itemData.link],
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
}: SidebarItemProps): React.Element<any> => (
  <React.Fragment>
    <SidebarItem
      itemData={itemData}
      isCollapsed={isCollapsed}
      onExpandClick={itemData.submenu && handleExpandClick}
      isExpanded={isExpanded}
      location={location}
      favoriteItems={favoriteItems}
    />
    {isExpanded &&
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
      isExpanded: expandedSection === itemData.name,
      expandedSection,
      itemData,
      ...rest,
    })
  )
)(SidebarItemWrapper);
