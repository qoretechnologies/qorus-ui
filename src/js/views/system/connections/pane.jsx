// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { upperFirst, includes, lowerCase } from 'lodash';

import Pane from '../../../components/pane';
import {
  Table,
  Tbody,
  Tr,
  Td,
  EditableCell,
  Th,
} from '../../../components/new_table';
import Box from '../../../components/box';
import NoData from '../../../components/nodata';
import actions from '../../../store/api/actions';
import Alert from '../../../components/alert';
import Options from './options';
import { getDependencyObjectLink } from '../../../helpers/system';
import AlertsTable from '../../../components/alerts_table';
import PaneItem from '../../../components/pane_item';
import { attrsSelector } from '../../../helpers/remotes';
import withDispatch from '../../../hocomponents/withDispatch';
import ContentByType from '../../../components/ContentByType';
import NameColumn from '../../../components/NameColumn';
import Loader from '../../../components/loader';
import settings from '../../../settings';

const remoteSelector = (state, props) =>
  state.api.remotes.data.find(a => a.name === props.paneId);

const viewSelector = createSelector(
  [remoteSelector, attrsSelector],
  (remote, attrs) => ({
    remote,
    attrs: attrs.attrs,
    editable: attrs.editable,
  })
);

@connect(viewSelector)
@withDispatch()
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
  } = this.props;

  state: {
    error: ?string,
    options: ?string,
    isPassLoaded: boolean,
  } = {
    error: null,
    options: null,
    isPassLoaded: this.props.remote.fetchedWithPass,
  };

  componentDidMount() {
    this.props.dispatchAction(
      actions.remotes.fetchPass,
      this.props.remoteType,
      this.props.remote.name,
      !settings.IS_HTTP
    );
  }

  componentWillReceiveProps(nextProps: Object) {
    if (
      this.props.remote.fetchedWithPass !== nextProps.remote.fetchedWithPass
    ) {
      this.setState({
        isPassLoaded: true,
      });
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
    const { optimisticDispatch, remoteType } = this.props;
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

        Object.keys(data[optsKey]).forEach(
          (key: string): void => {
            proceed = typeof data[optsKey][key] === 'object' ? false : proceed;
          }
        );
      }

      if (!proceed) {
        this.setState({
          error: 'The "options" object is invalid. It cannot be nested.',
        });
      } else if (optimisticDispatch) {
        optimisticDispatch(
          actions.remotes.manageConnection,
          remoteType,
          data,
          this.props.remote.name
        );
      }
    }
  };

  render() {
    const { deps, alerts, locked } = this.props.remote;
    const { isPassLoaded } = this.state;

    const canEdit = !locked && this.props.canEdit;

    return (
      <Pane
        width={this.props.width || 400}
        onClose={this.props.onClose}
        onResize={this.props.onResize}
        title={`${this.props.remote.name} detail`}
      >
        {!isPassLoaded ? (
          <Loader />
        ) : (
          <Box top fill scrollY>
            <PaneItem title="Overview">
              {this.state.error && (
                <Alert bsStyle="danger">{this.state.error}</Alert>
              )}
              {settings.IS_HTTP && (
                <Alert bsStyle="warning" title="Insecure connection">
                  Passwords are not displayedasjghsjkaghsakj
                </Alert>
              )}
              <Table condensed clean className="text-table">
                <Tbody>
                  {this.getData().map(
                    (val: Object, key: number): React.Element<any> => (
                      <Tr key={key}>
                        <Th className="name">
                          {upperFirst(val.attr.replace(/_/g, ' '))}
                        </Th>
                        {val.editable &&
                        canEdit &&
                        val.attr !== 'options' &&
                        val.attr !== 'opts' ? (
                          <EditableCell
                            className="text"
                            value={val.value}
                            onSave={this.handleEditSave(val.attr)}
                          />
                        ) : (
                          <Td className="text">
                            {val.attr === 'options' || val.attr === 'opts' ? (
                              <Options
                                data={val.value}
                                onSave={this.handleEditSave(val.attr)}
                                canEdit={canEdit}
                              />
                            ) : (
                              <ContentByType content={val.value} />
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
        )}
      </Pane>
    );
  }
}
