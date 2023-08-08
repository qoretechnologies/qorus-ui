// @flow
import { includes, lowerCase, upperFirst } from 'lodash';
import { Component } from 'react';
import { connect } from 'react-redux';
import mapProps from 'recompose/mapProps';
import { createSelector } from 'reselect';
import ContentByType from '../../../components/ContentByType';
import NameColumn from '../../../components/NameColumn';
import { SimpleTab, SimpleTabs } from '../../../components/SimpleTabs';
import Alert from '../../../components/alert';
import AlertsTable from '../../../components/alerts_table';
import Box from '../../../components/box';
import { EditableCell, Table, Tbody, Td, Th, Tr } from '../../../components/new_table';
import NoData from '../../../components/nodata';
import Pane from '../../../components/pane';
import PaneItem from '../../../components/pane_item';
import LogContainer from '../../../containers/log';
import { attrsMapper, attrsSelector } from '../../../helpers/remotes';
import { getDependencyObjectLink } from '../../../helpers/system';
import showIfPassed from '../../../hocomponents/show-if-passed';
import withDispatch from '../../../hocomponents/withDispatch';
import settings from '../../../settings';
import actions from '../../../store/api/actions';
import RemoteControls from './controls';
import Options from './options';

const remoteSelector = (state, props) =>
  state.api.remotes.data.find((a) => a.name === props.paneId);

const viewSelector = createSelector([remoteSelector, attrsSelector], (remote, attrs) => ({
  remote,
  attrs: attrs.attrs,
  editable: attrs.editable,
}));

@connect(viewSelector)
// @ts-ignore ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
@showIfPassed(({ remote }) => remote)
@withDispatch()
@mapProps(({ remote, ...rest }) => ({
  remote: { ...remote, url: settings.IS_HTTP ? remote.url : remote.safeUrl },
  ...rest,
}))
export default class ConnectionsPane extends Component {
  props: {
    remote: any;
    onClose: Function;
    attrs: Array<string>;
    editable: Array<string>;
    type: string;
    width: number;
    onResize: Function;
    optimisticDispatch: Function;
    dispatchAction: Function;
    remoteType: string;
    canEdit: boolean;
    paneId: string;
  } = this.props;

  // @ts-ignore ts-migrate(2741) FIXME: Property 'isPassLoaded' is missing in type '{ erro... Remove this comment to see the full error message
  state: {
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    error: string;
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    options: string;
    isPassLoaded: boolean;
  } = {
    error: null,
    options: null,
  };

  componentDidMount() {
    if (!settings.IS_HTTP) {
      this.props.dispatchAction(
        // @ts-ignore ts-migrate(2339) FIXME: Property 'remotes' does not exist on type '{}'.
        actions.remotes.fetchPass,
        this.props.remoteType,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
        this.props.remote.name
      );
    }
  }

  componentWillReceiveProps(nextProps: any) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'paneId' does not exist on type 'Object'.
    if (this.props.paneId !== nextProps.paneId && !settings.IS_HTTP) {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'dispatchAction' does not exist on type '... Remove this comment to see the full error message
      nextProps.dispatchAction(
        // @ts-ignore ts-migrate(2339) FIXME: Property 'remotes' does not exist on type '{}'.
        actions.remotes.fetchPass,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'remoteType' does not exist on type 'Obje... Remove this comment to see the full error message
        nextProps.remoteType,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'remote' does not exist on type 'Object'.
        nextProps.remote.name
      );
    }
  }

  getData: Function = (remote) => {
    const data = [];

    for (const attr of this.props.attrs) {
      data.push({
        attr,
        value: remote[attr],
        editable: includes(this.props.editable, attr),
      });
    }

    console.log({ data });

    return data;
  };

  handleEditSave: Function = (attr: string) => (value: any) => {
    const { dispatchAction, remoteType } = this.props;
    const optsKey = 'opts';
    const val = (value === '' || value === '{}') && attr === 'opts' ? null : value;

    const data = { ...this.props.remote, ...{ [attr]: val } };

    try {
      if (val && val !== '' && attr === 'opts') {
        JSON.parse(data[optsKey]);
      }
    } catch (e) {
      this.setState({
        error: 'The "options" value must be in valid JSON string format!',
      });
    } finally {
      let proceed = true;

      if (val && val !== '' && attr === 'opts') {
        data[optsKey] = JSON.parse(data[optsKey]);
      }

      if (!proceed) {
        this.setState({
          error: 'The "options" object is invalid. It cannot be nested.',
        });
      } else if (dispatchAction) {
        dispatchAction(
          // @ts-ignore ts-migrate(2339) FIXME: Property 'remotes' does not exist on type '{}'.
          actions.remotes.manageConnection,
          remoteType,
          data,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
          this.props.remote.name,
          null
        );
      }
    }
  };

  render() {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'deps' does not exist on type 'Object'.
    const { deps, alerts, locked, url_hash } = this.props.remote;
    // @ts-ignore ts-migrate(2339) FIXME: Property 'paneTab' does not exist on type '{ remot... Remove this comment to see the full error message
    const { paneTab, paneId, remoteType, dispatchAction } = this.props;
    const { isPassLoaded } = this.state;

    const canEdit = !locked && this.props.canEdit;
    // @ts-ignore ts-migrate(2339) FIXME: Property 'canDelete' does not exist on type '{ rem... Remove this comment to see the full error message
    const canDelete = this.props.canDelete;

    console.log('REMOTE AFTER UPDATE W/E', this.props.remote);

    return (
      <Pane
        width={this.props.width || 400}
        onClose={this.props.onClose}
        onResize={this.props.onResize}
        // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
        title={`${this.props.remote.name} detail`}
        tabs={{
          tabs: remoteType === 'datasources' ? ['Detail', 'Log'] : ['Detail'],
          queryIdentifier: 'paneTab',
        }}
      >
        <SimpleTabs activeTab={paneTab}>
          <SimpleTab name="detail">
            <Box top fill scrollY>
              <PaneItem
                title="Overview"
                label={
                  <RemoteControls
                    {...this.props.remote}
                    remoteType={remoteType}
                    dispatchAction={dispatchAction}
                    canEdit={canEdit}
                    canDelete={canDelete}
                    isPane
                  />
                }
              >
                {this.state.error && <Alert bsStyle="danger">{this.state.error}</Alert>}
                {settings.IS_HTTP && (
                  <Alert bsStyle="warning" title="Insecure connection">
                    Passwords are not displayed
                  </Alert>
                )}
                <Table condensed clean className="text-table" width="100%">
                  <Tbody>
                    {this.getData(this.props.remote).map(
                      // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
                      (val: any, key: number) => (
                        <Tr key={key}>
                          <Th className="name">
                            {upperFirst(
                              // @ts-ignore ts-migrate(2339) FIXME: Property 'attr' does not exist on type 'Object'.
                              attrsMapper(val.attr).replace(/_/g, ' ')
                            )}
                          </Th>
                          {/* @ts-ignore ts-migrate(2339) FIXME: Property 'editable' does not exist on type 'Object... Remove this comment to see the full error message */}
                          {val.editable &&
                          canEdit &&
                          // @ts-ignore ts-migrate(2339) FIXME: Property 'attr' does not exist on type 'Object'.
                          val.attr !== 'options' &&
                          // @ts-ignore ts-migrate(2339) FIXME: Property 'attr' does not exist on type 'Object'.
                          val.attr !== 'opts' ? (
                            // @ts-ignore ts-migrate(2739) FIXME: Type '{ noMarkdown: boolean; className: string; va... Remove this comment to see the full error message
                            <EditableCell
                              // @ts-ignore ts-migrate(2339) FIXME: Property 'attr' does not exist on type 'Object'.
                              noMarkdown={val.attr === 'url'}
                              className="text"
                              // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'Object'.
                              value={val.value}
                              // @ts-ignore ts-migrate(2339) FIXME: Property 'attr' does not exist on type 'Object'.
                              onSave={this.handleEditSave(val.attr)}
                            />
                          ) : (
                            <Td className="text">
                              {/* @ts-ignore ts-migrate(2339) FIXME: Property 'attr' does not exist on type 'Object'. */}
                              {val.attr === 'options' || val.attr === 'opts' ? (
                                <Options
                                  urlProtocol={url_hash?.protocol}
                                  // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'Object'.
                                  data={val.value}
                                  // @ts-ignore ts-migrate(2339) FIXME: Property 'attr' does not exist on type 'Object'.
                                  onSave={this.handleEditSave(val.attr)}
                                  canEdit={canEdit}
                                />
                              ) : (
                                <ContentByType
                                  // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'Object'.
                                  content={val.value}
                                  // @ts-ignore ts-migrate(2339) FIXME: Property 'attr' does not exist on type 'Object'.
                                  noMarkdown={val.attr === 'url'}
                                />
                              )}
                            </Td>
                          )}
                        </Tr>
                      )
                    )}
                  </Tbody>
                </Table>
              </PaneItem>
              <AlertsTable alerts={alerts} />
              <PaneItem title="Dependencies">
                {deps && deps.length ? (
                  <Table striped condensed>
                    <Tbody>
                      {deps.map(
                        // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
                        (dep: any, index: number) => (
                          <Tr key={index}>
                            <NameColumn
                              // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                              name={dep.name}
                              // @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
                              link={getDependencyObjectLink(dep.type, dep)}
                              // @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
                              type={lowerCase(dep.type)}
                            />
                          </Tr>
                        )
                      )}
                    </Tbody>
                  </Table>
                ) : (
                  <NoData />
                )}
              </PaneItem>
            </Box>
          </SimpleTab>
          {remoteType === 'datasources' && (
            <SimpleTab name="log">
              <Box top fill scrollY>
                <LogContainer
                  id={paneId}
                  intfc="remotes"
                  url="remote/datasources"
                  resource={`qdsp/${paneId}`}
                />
              </Box>
            </SimpleTab>
          )}
        </SimpleTabs>
      </Pane>
    );
  }
}
