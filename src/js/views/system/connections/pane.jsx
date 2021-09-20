// @flow
import { includes, lowerCase, upperFirst } from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapProps from 'recompose/mapProps';
import { createSelector } from 'reselect';
import Alert from '../../../components/alert';
import AlertsTable from '../../../components/alerts_table';
import Box from '../../../components/box';
import ContentByType from '../../../components/ContentByType';
import NameColumn from '../../../components/NameColumn';
import {
  EditableCell,
  Table,
  Tbody,
  Td,
  Th,
  Tr,
} from '../../../components/new_table';
import NoData from '../../../components/nodata';
import Pane from '../../../components/pane';
import PaneItem from '../../../components/pane_item';
import { SimpleTab, SimpleTabs } from '../../../components/SimpleTabs';
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

const viewSelector = createSelector(
  [remoteSelector, attrsSelector],
  (remote, attrs) => ({
    remote,
    attrs: attrs.attrs,
    editable: attrs.editable,
  })
);

@connect(viewSelector)
@showIfPassed(({ remote }) => remote)
@withDispatch()
@mapProps(({ remote, ...rest }) => ({
  remote: { ...remote, url: settings.IS_HTTP ? remote.url : remote.safeUrl },
  ...rest,
}))
export default class ConnectionsPane extends Component {
  props: {
    remote: Object,
    onClose: Function,
    attrs: Array<string>,
    editable: Array<string>,
    type: string,
    width: number,
    onResize: Function,
    optimisticDispatch: Function,
    dispatchAction: Function,
    remoteType: string,
    canEdit: boolean,
    paneId: string,
  } = this.props;

  state: {
    error: ?string,
    options: ?string,
    isPassLoaded: boolean,
  } = {
    error: null,
    options: null,
  };

  componentDidMount() {
    if (!settings.IS_HTTP) {
      this.props.dispatchAction(
        actions.remotes.fetchPass,
        this.props.remoteType,
        this.props.remote.name
      );
    }
  }

  componentWillReceiveProps(nextProps: Object) {
    if (this.props.paneId !== nextProps.paneId && !settings.IS_HTTP) {
      nextProps.dispatchAction(
        actions.remotes.fetchPass,
        nextProps.remoteType,
        nextProps.remote.name
      );
    }
  }

  getData: Function = () => {
    const data = [];

    for (const attr of this.props.attrs) {
      data.push({
        attr,
        value: this.props.remote[attr],
        editable: includes(this.props.editable, attr),
      });
    }

    return data;
  };

  handleEditSave: Function = (attr: string) => (value: any) => {
    const { dispatchAction, remoteType } = this.props;
    const optsKey = 'opts';
    const val =
      (value === '' || value === '{}') && attr === 'opts' ? null : value;

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

        Object.keys(data[optsKey]).forEach((key: string): void => {
          proceed = typeof data[optsKey][key] === 'object' ? false : proceed;
        });
      }

      if (!proceed) {
        this.setState({
          error: 'The "options" object is invalid. It cannot be nested.',
        });
      } else if (dispatchAction) {
        dispatchAction(
          actions.remotes.manageConnection,
          remoteType,
          data,
          this.props.remote.name,
          null
        );
      }
    }
  };

  render() {
    const { deps, alerts, locked, url_hash } = this.props.remote;
    const { paneTab, paneId, remoteType, dispatchAction } = this.props;
    const { isPassLoaded } = this.state;

    const canEdit = !locked && this.props.canEdit;
    const canDelete = this.props.canDelete;

    return (
      <Pane
        width={this.props.width || 400}
        onClose={this.props.onClose}
        onResize={this.props.onResize}
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
                {this.state.error && (
                  <Alert bsStyle="danger">{this.state.error}</Alert>
                )}
                {settings.IS_HTTP && (
                  <Alert bsStyle="warning" title="Insecure connection">
                    Passwords are not displayed
                  </Alert>
                )}
                <Table condensed clean className="text-table">
                  <Tbody>
                    {this.getData().map(
                      (val: Object, key: number): React.Element<any> => (
                        <Tr key={key}>
                          <Th className="name">
                            {upperFirst(
                              attrsMapper(val.attr).replace(/_/g, ' ')
                            )}
                          </Th>
                          {val.editable &&
                          canEdit &&
                          val.attr !== 'options' &&
                          val.attr !== 'opts' ? (
                            <EditableCell
                              noMarkdown={val.attr === 'url'}
                              className="text"
                              value={val.value}
                              onSave={this.handleEditSave(val.attr)}
                            />
                          ) : (
                            <Td className="text">
                              {val.attr === 'options' || val.attr === 'opts' ? (
                                <Options
                                  urlProtocol={url_hash?.protocol}
                                  data={val.value}
                                  onSave={this.handleEditSave(val.attr)}
                                  canEdit={canEdit}
                                />
                              ) : (
                                <ContentByType
                                  content={val.value}
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
                        (dep: Object, index: number): React.Element<any> => (
                          <Tr key={index}>
                            <NameColumn
                              name={dep.name}
                              link={getDependencyObjectLink(dep.type, dep)}
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
