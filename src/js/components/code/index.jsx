/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
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
import Flex from '../Flex';
import { FormattedMessage, injectIntl } from 'react-intl';

type Props = {
  data: Object,
  selected: Object,
  onItemClick: Function,
  handleItemClick: Function,
  setSelected: Function,
  location: Object,
};

const Code: Function = ({
  data,
  handleItemClick,
  selected,
  location,
  intl,
}: Props): React.Element<any> => (
  <Flex className="code" flexFlow="row">
    <Flex className="code-list" scrollY>
      {Object.keys(data).map(
        (name: string, index: number): React.Element<any> => (
          <Section
            key={name}
            name={intl.formatMessage({ id: name })}
            items={data[name]}
            onItemClick={handleItemClick}
            selected={selected}
          />
        )
      )}
    </Flex>
    <Flex className="code-source">
      {selected ? (
        <Flex>
          {selected.type &&
          (selected.type !== 'code' && selected.type !== 'methods') ? (
            <Tabs active="code">
              <Pane name="Code">
                <CodeTab selected={selected} />
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
            <CodeTab selected={selected} />
          )}
        </Flex>
      ) : (
        <Alert bsStyle="info">
          {' '}
          <FormattedMessage id="component.please-select-item" />{' '}
        </Alert>
      )}
    </Flex>
  </Flex>
);

export default compose(
  withState('selected', 'setSelected', ({ selected }) => selected || null),
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
  }),
  pure(['data', 'selected']),
  injectIntl
)(Code);
