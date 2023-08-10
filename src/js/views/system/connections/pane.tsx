// @flow
import { ReqoreKeyValueTable, ReqoreMessage } from '@qoretechnologies/reqore';
import { includes, lowerCase, omit, pick } from 'lodash';
import { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import mapProps from 'recompose/mapProps';
import { createSelector } from 'reselect';
import NameColumn from '../../../components/NameColumn';
import { SimpleTab, SimpleTabs } from '../../../components/SimpleTabs';
import AlertsTable from '../../../components/alerts_table';
import Box from '../../../components/box';
import { Table, Tbody, Tr } from '../../../components/new_table';
import NoData from '../../../components/nodata';
import Pane from '../../../components/pane';
import PaneItem from '../../../components/pane_item';
import LogContainer from '../../../containers/log';
import { attrsSelector } from '../../../helpers/remotes';
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

class ConnectionsPane extends Component {
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
        actions={[
          {
            icon: 'EditLine',
            tooltip: 'Edit',
            onClick: () => this.props.handleEditClick(this.props.remote),
          },
        ]}
      >
        <SimpleTabs activeTab={paneTab}>
          <SimpleTab name="detail" scrollY>
            {this.state.error && <ReqoreMessage intent="danger">{this.state.error}</ReqoreMessage>}
            {settings.IS_HTTP && (
              <ReqoreMessage intent="warning" title="Insecure connection">
                Passwords are not displayed
              </ReqoreMessage>
            )}
            <ReqoreKeyValueTable
              label="Overview"
              keyAlign="right"
              sortable
              filterable
              zoomable
              exportable
              keyIcon="InformationLine"
              valueIcon="PriceTagLine"
              keyRenderer={(key: string | number) =>
                this.props.intl.formatMessage({ id: `connection.${key}` })
              }
              actions={[
                {
                  as: RemoteControls,
                  props: {
                    ...this.props.remote,
                    remoteType,
                    dispatchAction,
                    canEdit,
                    canDelete,
                    isPane: true,
                    big: true,
                  },
                },
              ]}
              data={omit(pick(this.props.remote, this.props.attrs), ['opts'])}
              striped
              keyColumnIntent={undefined}
            />
            <Options
              urlProtocol={url_hash?.protocol}
              data={this.props.remote.opts}
              onSave={this.handleEditSave('opts')}
              canEdit={canEdit}
            />
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

export default compose(
  connect(viewSelector),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  showIfPassed(({ remote }) => remote),
  withDispatch(),
  mapProps(({ remote, ...rest }) => ({
    remote: { ...remote, url: settings.IS_HTTP ? remote.url : remote.safeUrl },
    ...rest,
  })),
  injectIntl
)(ConnectionsPane);
