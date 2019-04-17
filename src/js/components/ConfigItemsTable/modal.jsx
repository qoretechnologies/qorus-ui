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

export default class ConfigItemsModal extends Component {
  props: Props = this.props;

  state: {
    value: any,
    override: boolean,
    error: boolean,
    yamlData?: string,
  } = {
    value: this.props.item.value,
    override: this.props.item.override,
    error: false,
    yamlData: null,
  };

  async componentDidMount () {
    const stepPath: string = this.props.stepId
      ? `/stepinfo/${this.props.stepId}`
      : '';

    const interfacePath: string = this.props.intrfId
      ? `${this.props.intrf}/${this.props.intrfId}${stepPath}`
      : 'system';

    const yamlData: Object = await get(
      `${settings.REST_BASE_URL}/${interfacePath}/config/${
        this.props.item.name
      }?action=yaml`
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

  handleOverrideChange: Function = (override): void => {
    if (override) {
      this.setState({
        value: this.state.yamlData.value,
        override: true,
        error: false,
      });
    } else {
      this.setState({
        value: this.state.yamlData.value,
        override: false,
        error: false,
      });
    }
  };

  handleDefaultClick = () => {
    this.setState({
      value: this.props.yamlData.default_value,
    });
  };

  handleSaveClick: Function = (): void => {
    const value: any = this.state.value;

    this.props.onSubmit(
      this.props.item,
      this.props.belongsTo,
      value,
      this.state.override,
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
    const { override, error, yamlData } = this.state;

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
                {item.allow_override ? (
                  <Alert bsStyle="info" iconName="info-sign">
                    Select which value is used by this config item
                  </Alert>
                ) : (
                  <Alert bsStyle="info">
                    This config item's value cannot be overridden
                  </Alert>
                )}
                <div
                  className={`configItemsEditor ${!item.allow_override &&
                    'editorDisabled'} ${override && 'editorOverride'}`}
                  onClick={() => {
                    this.handleOverrideChange(true);
                  }}
                >
                  <div className="header">
                    <Icon iconName={override ? 'selection' : 'circle'} />{' '}
                    Override with parent value
                  </div>
                  <div className="body">
                    {item.type === 'hash' || item.type === 'list' ? (
                      <Tree compact data={item.parent_value} />
                    ) : (
                      <ContentByType inTable content={item.parent_value} />
                    )}
                  </div>
                </div>
                <div
                  className={`configItemsEditor ${!override &&
                    'editorOverride'}`}
                  onClick={() => {
                    this.handleOverrideChange(false);
                  }}
                >
                  <div className="header">
                    <Icon iconName={!override ? 'selection' : 'circle'} /> Use
                    item's value
                    <Pull right>
                      <ButtonGroup>
                        <Button
                          label="Set default value"
                          disabled={override}
                          onClick={this.handleDefaultClick}
                        />
                      </ButtonGroup>
                    </Pull>
                  </div>
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
