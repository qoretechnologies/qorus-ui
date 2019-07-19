// @flow
import React, { Component } from 'react';

import Modal from '../modal';
import Box from '../box';
import ContentByType from '../ContentByType';
import {
  Icon,
  TextArea,
  Popover,
  Button as Btn,
  ButtonGroup as BtnGrp,
  Intent,
  Position,
} from '@blueprintjs/core';
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
  levelType: string,
  intrf: string,
  intrfId: number,
  stepId: number,
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
    const { intrf, stepId, levelType, intrfId, item } = this.props;
    if (
      item.level &&
      (item.level.startsWith(levelType) || item.level === 'default')
    ) {
      const stepPath: string = stepId ? `/stepinfo/${stepId}` : '';

      const interfacePath: string = intrfId
        ? `${intrf}/${intrfId}${stepPath}`
        : 'system';

      const yamlData: Object = await get(
        `${settings.REST_BASE_URL}/${interfacePath}/config/${
          item.name
        }?action=yaml`
      );

      this.setState({
        yamlData,
        value: yamlData.value,
      });
    } else {
      this.setState({
        yamlData: true,
        value: '',
      });
    }
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
      jsyaml.safeDump(value);
    } catch (e) {
      this.setState({ error: true });
    }
  };

  handleDefaultClick = () => {
    this.setState({
      value: this.state.yamlData.default_value,
    });
  };

  handleSaveClick: Function = (): void => {
    const value: any = this.state.value;

    let newValue = value;

    if (this.props.item.type === 'string' && value === '') {
      newValue = jsyaml.safeDump(value);
    }

    this.props.onSubmit(
      this.props.item,
      newValue,
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
            <DControl small>
              {this.state.value === 'true' ? 'True' : 'False'}
            </DControl>
            <Item
              title="True"
              onClick={() => {
                this.handleValueChange('true');
              }}
            />
            <Item
              title="False"
              onClick={() => {
                this.handleValueChange('false');
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
    const { override, error, yamlData, value } = this.state;

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
                  <div className="header">
                    {item.name}
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
            <ButtonGroup>
              <Button label="Cancel" btnStyle="default" action={onClose} big />
              {value === yamlData?.default_value ? (
                <Popover
                  position={Position.TOP}
                  content={
                    <Box fill top style={{ width: '300px' }}>
                      <p>
                        The value submitted is same as default value, but will
                        not change when default value is changed in the future.
                      </p>
                      <BtnGrp>
                        <Btn
                          className="pt-fill"
                          text="Submit anyway"
                          intent={Intent.SUCCESS}
                          onClick={this.handleSaveClick}
                        />
                      </BtnGrp>
                    </Box>
                  }
                >
                  <Btn
                    text="Save"
                    iconName="warning-sign"
                    intent={Intent.WARNING}
                  />
                </Popover>
              ) : (
                <Button
                  label="Save"
                  btnStyle="success"
                  disabled={error}
                  action={this.handleSaveClick}
                  big
                />
              )}
            </ButtonGroup>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }
}
