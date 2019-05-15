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
import map from 'lodash/map';
import pickBy from 'lodash/pickBy';

type Props = {
  onClose: Function,
  item: Object,
  onSubmit: Function,
  globalConfig: Object,
};

export default class AddConfigItemModal extends Component {
  props: Props = this.props;

  state: {
    value: any,
    error: boolean,
    yamlData?: string,
    selectedItem: Object,
  } = {
    value: null,
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
      jsyaml.safeLoad(value);
    } catch (e) {
      this.setState({ error: true });
    }
  };

  handleSaveClick: Function = (): void => {
    const { value, selectedItem } = this.state;

    this.props.onSubmit(selectedItem, value, this.props.onClose, null);
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
    const { error, selectedItem } = this.state;
    const globalConfigItems = pickBy(globalConfig, (data, name) => !data.value);

    return (
      <Modal hasFooter>
        <Modal.Header onClose={onClose} titleId="yamlEdit">
          Add new global value for this interface
        </Modal.Header>
        <Modal.Body>
          <Box top fill>
            <Alert bsStyle="warning">
              Creating new global config value will affect all interfaces using
              this item.
            </Alert>
            <Dropdown>
              <DControl>{selectedItem?.name || 'Please select'}</DControl>
              {map(globalConfigItems, data => (
                <Item
                  title={data.name}
                  onClick={(event, name) =>
                    this.setState({
                      value: null,
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
                disabled={error || !selectedItem}
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
