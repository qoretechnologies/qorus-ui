// @flow
import React, { Component } from 'react';

import Modal from '../modal';
import { Controls, Control } from '../controls';
import Box from '../box';
import ContentByType from '../ContentByType';
import { Icon, TextArea } from '@blueprintjs/core';
import DatePicker from '../datepicker';
import Dropdown, { Item, Control as DControl } from '../../components/dropdown';
import { getLineCount } from '../../helpers/system';
import Alert from '../alert';
import Tree from '../tree';
import settings from '../../settings';
import { get } from '../../store/api/utils';
import Loader from '../loader';
import jsyaml from 'js-yaml';
import moment from 'moment';
import { DATE_FORMATS } from '../../constants/dates';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../components/controls';
import Pull from '../Pull';

type Props = {
  onClose: Function,
  item: Object,
  belongsTo: string,
  onSubmit: Function,
};

export default class WorkflowConfigItemsModal extends Component {
  props: Props = this.props;

  state: {
    value: any,
    error: boolean,
    yamlData?: string,
  } = {
    value: this.props.item.value,
    error: false,
    yamlData: null,
  };

  async componentDidMount () {
    const { intrf, intrfId, item } = this.props;
    const yamlData: Object = await get(
      `${settings.REST_BASE_URL}/${intrf}${
        intrfId ? `/${intrfId}` : ''
      }/config/${item.name}?action=yaml`
    );

    this.setState({
      yamlData,
      value: yamlData.value,
    });
  }

  handleValueChange: Function = (value): void => {
    this.setState({ value });
  };

  handleDateChange: Function = (value): void => {
    let newValue: any = moment(value, DATE_FORMATS.URL_FORMAT);
    newValue = newValue.format(DATE_FORMATS.DISPLAY);

    this.setState({ value: newValue });
  };

  handleObjectChange: Function = (value): void => {
    this.setState({ value, error: false });

    try {
      jsyaml.safeLoad(value);
    } catch (e) {
      this.setState({ error: true });
    }
  };

  handleSaveClick: Function = (): void => {
    const value: any = this.state.value;

    this.props.onSubmit(
      this.props.item,
      value,
      () => {
        this.props.onClose();
      },
      this.props.stepId
    );
  };

  renderValueContent: Function = (): React.Element<any> => {
    const { item } = this.props;
    const { override } = this.state;

    switch (item.type) {
      case 'bool':
        return (
          <Dropdown>
            <DControl small>{this.state.value ? 'True' : 'False'}</DControl>
            <Item
              title="True"
              onClick={() => {
                this.handleValueChange(true);
              }}
            />
            <Item
              title="False"
              onClick={() => {
                this.handleValueChange(false);
              }}
            />
          </Dropdown>
        );
      case 'date':
        return (
          <DatePicker
            disabled={override}
            date={this.state.value}
            onApplyDate={(newValue: any) => {
              this.handleDateChange(newValue);
            }}
            className="pt-fill"
            noButtons
            small
          />
        );
      case 'hash':
      case 'list':
        return (
          <TextArea
            className="pt-fill"
            rows={getLineCount(this.state.value, null, 4)}
            value={this.state.value}
            disabled={this.state.override}
            onChange={(event: any) => {
              this.handleObjectChange(event.target.value);
            }}
          />
        );
      default:
        return (
          <TextArea
            className="pt-fill"
            rows={getLineCount(this.state.value, null, 4)}
            value={this.state.value}
            disabled={this.state.override}
            onChange={(event: any) => {
              this.handleObjectChange(event.target.value);
            }}
          />
        );
    }
  };

  render () {
    const { onClose, item } = this.props;
    const { error, yamlData } = this.state;

    return (
      <Modal hasFooter>
        <Modal.Header onClose={onClose} titleId="yamlEdit">
          Editing '{item.name}' config item
        </Modal.Header>
        <Modal.Body>
          <Box top fill>
            {!yamlData ? (
              <Loader />
            ) : (
              <React.Fragment>
                <div className="configItemsEditor">
                  <div className="header">{item.name}</div>
                  <div className="body">
                    {error && (
                      <Alert bsStyle="danger">
                        The provided value is not in correct format
                      </Alert>
                    )}
                    {this.renderValueContent()}
                  </div>
                </div>
              </React.Fragment>
            )}
          </Box>
        </Modal.Body>
        <Modal.Footer>
          <div className="pull-right">
            <Controls grouped noControls>
              <Control label="Cancel" btnStyle="default" action={onClose} big />
              <Control
                label="Save"
                btnStyle="success"
                disabled={error}
                action={this.handleSaveClick}
                big
              />
            </Controls>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }
}
