/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import mapProps from 'recompose/mapProps';
import lifecycle from 'recompose/lifecycle';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';

import Section from './section';
import CodeTab from './code';
import ReleasesTab from '../../containers/releases';
import Tabs, { Pane } from '../tabs';
import DependenciesList from './dependencies';
import InfoTable from '../info_table';
import Alert from '../alert';

type Props = {
  data: Object,
  height: string | number,
  heightUpdated: Function,
  selected: Object,
  onItemClick: Function,
  handleItemClick: Function,
  setSelected: Function,
  location: Object,
};

const Code: Function = ({
  data,
  height,
  handleItemClick,
  selected,
  location,
}: Props): React.Element<any> => (
  <div className="code">
    <div className="code-list" style={{ height }}>
      {Object.keys(data).map(
        (name: string, index: number): React.Element<any> => (
          <Section
            key={index}
            name={name}
            items={data[name]}
            onItemClick={handleItemClick}
            selected={selected}
          />
        )
      )}
    </div>
    <div className="code-source">
      {selected ? (
        <div>
          {selected.type &&
          (selected.type !== 'code' && selected.type !== 'methods') ? (
            <Tabs active="code">
              <Pane name="Code">
                <CodeTab selected={selected} height={height} />
              </Pane>
              <Pane name="Info">
                <InfoTable
                  object={{
                    author: selected.item.author,
                    source:
                      selected.item.source &&
                      `${selected.item.source}:${selected.item.offset || ''}`,
                    description: selected.item.description,
                    tags:
                      selected.item.tags &&
                      Object.keys(selected.item.tags).length,
                  }}
                />
              </Pane>
              <Pane name="Releases">
                <ReleasesTab
                  component={selected.item.name}
                  location={location}
                  key={selected.item.name}
                  compact
                />
              </Pane>
              {selected.item.requires && selected.item.requires.length > 0 ? (
                <Pane name="Dependencies">
                  <DependenciesList
                    classes={data.classes}
                    dependenciesList={selected.item.requires}
                  />
                </Pane>
              ) : null}
            </Tabs>
          ) : (
            <CodeTab selected={selected} height={height} />
          )}
        </div>
      ) : (
        <Alert bsStyle="info"> Please select an item from the list </Alert>
      )}
    </div>
  </div>
);

export default compose(
  withState('height', 'setHeight', 'auto'),
  withState('selected', 'setSelected', ({ selected }) => selected || null),
  mapProps(
    ({ heightUpdater, setHeight, ...rest }): Object => ({
      calculateHeight: () =>
        setHeight(
          (height: string | number) =>
            heightUpdater ? heightUpdater() : height
        ),
      ...rest,
    })
  ),
  withHandlers({
    handleItemClick: ({ setSelected, onItemClick }: Props): Function => (
      name: string,
      code: string,
      type: string,
      id: number,
      item: Object
    ): void => {
      if (onItemClick && !code) {
        onItemClick(name, code, type, id);
        setSelected(() => ({
          name,
          code,
          item,
          type,
          id,
          loading: true,
        }));
      } else {
        setSelected(() => ({
          name,
          code,
          item,
          type,
        }));
      }
    },
  }),
  lifecycle({
    componentWillMount() {
      this.props.calculateHeight();

      window.addEventListener('resize', this.props.calculateHeight);
    },
    componentWillReceiveProps(nextProps) {
      if (this.props.data !== nextProps.data) {
        this.props.setSelected(selected => {
          if (!selected || !nextProps.data[selected.type]) return null;

          const item = nextProps.data[selected.type].find(
            (itm: Object) => itm.id === selected.id
          );

          if (item) {
            return {
              name: selected.name,
              code: item.body,
              item,
              type: selected.type,
              loading: false,
            };
          }

          return selected;
        });
      }
    },
    componentWillUnmount() {
      window.removeEventListener('resize', this.props.calculateHeight);
    },
  }),
  pure(['data', 'selected', 'height'])
)(Code);
