/* @flow */
import { AnchorButton } from '@blueprintjs/core';
import { ReqoreMessage, ReqoreTag, ReqoreTagGroup } from '@qoretechnologies/reqore';
import map from 'lodash/map';
import { FormattedMessage, injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import { WEB_IDE_URL } from '../../../server_config';
import ReleasesTab from '../../containers/releases';
import { isFeatureEnabled } from '../../helpers/functions';
import Flex from '../Flex';
import Alert from '../alert';
import InfoTable from '../info_table';
import Tabs, { Pane } from '../tabs';
import CodeTab from './code';
import DependenciesList from './dependencies';
import Section from './section';

type Props = {
  data: any;
  selected: any;
  onItemClick: Function;
  handleItemClick: Function;
  setSelected: Function;
  location: any;
};

const Code: Function = ({
  data,
  handleItemClick,
  selected,
  location,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  <Flex className="code" flexFlow="row">
    <Flex className="code-list" scrollY>
      {Object.keys(data)
        .filter((item) => item !== 'fsm_triggers')
        .map(
          // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
          (name: string, index: number) => (
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
          {/* @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'. */}
          {selected.type &&
          // @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
          selected.type !== 'code' &&
          // @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
          selected.type !== 'methods' ? (
            // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
            <Tabs
              active="code"
              rightElement={
                // @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
                selected.type === 'classes' && selected.item && isFeatureEnabled('WEB_IDE') ? (
                  <AnchorButton
                    icon="code-block"
                    // @ts-ignore ts-migrate(2339) FIXME: Property 'item' does not exist on type 'Object'.
                    href={`${WEB_IDE_URL}new/class/${selected.item.id}?origin=${window.location.href}`}
                  >
                    <FormattedMessage id="button.edit-class" />
                  </AnchorButton>
                ) : undefined
              }
            >
              {/* @ts-ignore ts-migrate(2322) FIXME: Type '{ children: Element; name: string; }' is not... Remove this comment to see the full error message */}
              <Pane name="Code">
                <CodeTab selected={selected} />
              </Pane>
              {selected.type === 'fsm' && (
                <Pane name="Triggers">
                  {data.fsm_triggers && data.fsm_triggers[selected.item.name] ? (
                    data.fsm_triggers[selected.item.name].map((trigger) => (
                      <>
                        {map(trigger, (value, key) => (
                          <ReqoreTagGroup>
                            <ReqoreTag label={key} intent="warning" />
                            <ReqoreTag label={value} intent="info" />
                          </ReqoreTagGroup>
                        ))}
                      </>
                    ))
                  ) : (
                    <ReqoreMessage intent="warning">No triggers found</ReqoreMessage>
                  )}
                </Pane>
              )}
              {/* @ts-ignore ts-migrate(2322) FIXME: Type '{ children: Element; name: string; }' is not... Remove this comment to see the full error message */}
              <Pane name="Info">
                <InfoTable
                  object={{
                    // @ts-ignore ts-migrate(2339) FIXME: Property 'item' does not exist on type 'Object'.
                    author: selected.item.author,
                    source:
                      // @ts-ignore ts-migrate(2339) FIXME: Property 'item' does not exist on type 'Object'.
                      selected.item.source &&
                      // @ts-ignore ts-migrate(2339) FIXME: Property 'item' does not exist on type 'Object'.
                      `${selected.item.source}:${selected.item.offset || ''}`,
                    // @ts-ignore ts-migrate(2339) FIXME: Property 'item' does not exist on type 'Object'.
                    description: selected.item.description,
                    tags:
                      // @ts-ignore ts-migrate(2339) FIXME: Property 'item' does not exist on type 'Object'.
                      selected.item.tags &&
                      // @ts-ignore ts-migrate(2339) FIXME: Property 'item' does not exist on type 'Object'.
                      Object.keys(selected.item.tags).length,
                  }}
                />
              </Pane>
              {/* @ts-ignore ts-migrate(2322) FIXME: Type '{ children: Element; name: string; }' is not... Remove this comment to see the full error message */}
              <Pane name="Releases">
                <ReleasesTab
                  // @ts-ignore ts-migrate(2339) FIXME: Property 'item' does not exist on type 'Object'.
                  component={selected.item.name}
                  location={location}
                  compact
                />
              </Pane>
              {/* @ts-ignore ts-migrate(2339) FIXME: Property 'item' does not exist on type 'Object'. */}
              {selected.item.requires && selected.item.requires.length > 0 ? (
                // @ts-ignore ts-migrate(2322) FIXME: Type '{ children: Element; name: string; }' is not... Remove this comment to see the full error message
                <Pane name="Dependencies">
                  <DependenciesList
                    // @ts-ignore ts-migrate(2339) FIXME: Property 'classes' does not exist on type 'Object'... Remove this comment to see the full error message
                    classes={data.classes}
                    // @ts-ignore ts-migrate(2339) FIXME: Property 'item' does not exist on type 'Object'.
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
  withState('selected', 'setSelected', ({ selected, codeItemQuery }) => selected || null),
  withHandlers({
    handleItemClick:
      ({ setSelected, onItemClick }: Props): Function =>
      (name: string, code: string, type: string, id: number, item: any): void => {
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
      this.props.setSelected(() => {
        const codeItemQuery = this.props.location.query.codeItem;
        let type;
        let item;
        // Find the FSM or the method in the data
        const maybeFSM = this.props.data.fsm?.find((fsm) => fsm.name === codeItemQuery);
        const maybeMethod = this.props.data.methods?.find(
          (method) => method.name === codeItemQuery
        );

        type = maybeFSM ? 'fsm' : maybeMethod ? 'method' : null;
        item = maybeFSM || maybeMethod;

        if (type) {
          return {
            name: item.name,
            code: item.body || item.code,
            item,
            type,
            loading: false,
          };
        }

        return null;
      });
    },
    componentWillReceiveProps(nextProps) {
      const oldData = JSON.stringify(this.props.data);
      const newData = JSON.stringify(nextProps.data);
      const codeItemQuery = this.props.location.query.codeItem;
      const nextCodeItemQuery = nextProps.location.query.codeItem;

      if (codeItemQuery !== nextCodeItemQuery) {
        this.props.setSelected(() => {
          let type;
          let item;
          // Find the FSM or the method in the data
          const maybeFSM = nextProps.data.fsm.find((fsm) => fsm.name === nextProps.codeItemQuery);
          const maybeMethod = nextProps.data.methods.find(
            (method) => method.name === nextProps.codeItemQuery
          );

          type = maybeFSM ? 'fsm' : maybeMethod ? 'method' : null;
          item = maybeFSM || maybeMethod;

          if (type) {
            return {
              name: item.name,
              code: item.body || item.code,
              item,
              type,
              loading: false,
            };
          }

          return null;
        });
      }

      if (oldData !== newData) {
        this.props.setSelected((selected) => {
          if (!selected || !nextProps.data[selected.type]) return null;

          const item = nextProps.data[selected.type].find(
            // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
            (itm: any) => itm.id === selected.id
          );

          if (item) {
            return {
              name: selected.name,
              code: item.body || item.code,
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
