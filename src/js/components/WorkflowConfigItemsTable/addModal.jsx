// @flow
import React, { Component } from 'react';

import Modal from '../modal';
import { Controls, Control } from '../controls';
import Box from '../box';
import { TextArea } from '@blueprintjs/core';
import DatePicker from '../datepicker';
import Dropdown, { Item, Control as DControl } from '../dropdown';
import { getLineCount } from '../../helpers/system';
import Alert from '../alert';
import jsyaml from 'js-yaml';
import moment from 'moment';
import { DATE_FORMATS } from '../../constants/dates';
import map from 'lodash/map';
import pickBy from 'lodash/pickBy';
import isNull from 'lodash/isNull';

type Props = {
  onClose: Function,
  item: Object,
  onSubmit: Function,
  globalConfig: Object,
};

export default class WorkflowAddConfigItemModal extends Component {
  props: Props = this.props;

  state: {
    value: any,
    error: boolean,
    yamlData?: string,
    selectedItem: Object,
  } = {
    value: '',
    error: false,
    yamlData: null,
    selectedItem: null,
  };

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
      jsyaml.safeDump(value);
    } catch (e) {
      this.setState({ error: true });
    }
  };

  handleSaveClick: Function = (): void => {
    const { value, selectedItem } = this.state;

    let newValue = value;

    if (selectedItem.type === 'bool' || selectedItem.type === 'string') {
      newValue = jsyaml.safeDump(value);
    }

    this.props.onSubmit(selectedItem, newValue, this.props.onClose, null);
  };

  renderValueContent: Function = (): React.Element<any> => {
    const { selectedItem } = this.state;

    switch (selectedItem.type) {
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
            onChange={(event: any) => {
              this.handleObjectChange(event.target.value);
            }}
          />
        );
    }
  };

  render () {
    const { onClose, globalConfig } = this.props;
    const { error, selectedItem, value } = this.state;
    const globalConfigItems = pickBy(globalConfig, (data, name) =>
      isNull(data.value)
    );

    return (
      <Modal hasFooter>
        <Modal.Header onClose={onClose} titleId="yamlEdit">
          Add new workflow value for this interface
        </Modal.Header>
        <Modal.Body>
          <Box top fill>
            <Dropdown>
              <DControl>{selectedItem?.name || 'Please select'}</DControl>
              {map(globalConfigItems, data => (
                <Item
                  title={data.name}
                  onClick={(event, name) =>
                    this.setState({
                      value: '',
                      selectedItem: {
                        name,
                        type: data.type,
                      },
                    })
                  }
                />
              ))}
            </Dropdown>
            {selectedItem && (
              <React.Fragment>
                <br />
                <div className="configItemsEditor">
                  <div className="header">{selectedItem.name}</div>
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
                disabled={error || !selectedItem || isNull(this.state.value)}
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
