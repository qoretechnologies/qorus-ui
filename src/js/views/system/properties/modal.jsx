// @flow
import React, { Component } from 'react';
import includes from 'lodash/includes';

import { Controls, Control } from '../../../components/controls';
import Dropdown, {
  Control as DControl,
  Item as DItem,
} from '../../../components/dropdown';
import Modal from '../../../components/modal';
import Box from '../../../components/box';

export default class extends Component {
  props: {
    onMount: Function,
    onClose: Function,
    onSubmit: Function,
    data: Object,
    collection: Object,
  } = this.props;

  state: {
    domain: string,
    key: string,
    showDomains: boolean,
    showKeys: boolean,
  } = {
    domain: this.props.data ? this.props.data.domain : '',
    key: this.props.data ? this.props.data.key : '',
    showDomains: false,
    showKeys: false,
  };

  handleDomainChange = (event: EventHandler): void => {
    if (event.target.value === '') {
      this.setState({
        domain: event.target.value,
        showDomains: false,
      });
    } else {
      const domains: Array<string> = this.getDomainList(event.target.value);

      this.setState({
        domain: event.target.value,
        showDomains: !!domains.length,
      });
    }
  };

  handleKeyChange = (event: EventHandler): void => {
    const { collection } = this.props;
    const domain = collection[this.state.domain];

    if (event.target.value === '' || !domain) {
      this.setState({
        key: event.target.value,
        showKeys: false,
      });
    } else {
      const keys: Array<string> = this.getKeyList(event.target.value);

      this.setState({
        key: event.target.value,
        showKeys: !!keys.length,
      });
    }
  };

  handleDomainClose: Function = () => {
    this.setState({
      showDomains: false,
    });
  };

  handleDomainSelect: Function = (
    event: EventHandler,
    domain: string
  ): void => {
    this.setState({ domain });
  };

  handleKeysClose: Function = () => {
    this.setState({
      showKeys: false,
    });
  };

  handleKeySelect: Function = (event: EventHandler, key: string): void => {
    this.setState({ key });
  };

  handleFormSubmit = (event: EventHandler): void => {
    event.preventDefault();

    const { domain, key, value } = this.refs;
    let val = value.value;

    try {
      val = JSON.parse(value.value);
    } catch (e) {
      val = value.value;
    } finally {
      this.props.onSubmit({
        domain: domain.value,
        key: key.value,
        value: val,
      });

      this.props.onClose();
    }
  };

  getDomainList: Function = (value: string): Array<string> =>
    Object.keys(this.props.collection).filter(
      (domain: string): boolean => includes(domain, value)
    );

  getKeyList: Function = (value: string): Array<string> =>
    this.props.collection[this.state.domain].filter(
      (item: Object): boolean => (value ? includes(item.name, value) : true)
    );

  renderDomains: Function = (): Array<React.Element<any>> =>
    this.getDomainList(this.state.domain).map((domain: string, key: number) => (
      <DItem key={key} title={domain} action={this.handleDomainSelect} />
    ));

  renderKeys: Function = (): ?Array<React.Element<any>> =>
    this.getKeyList(this.state.key).map((item: Object, index: number) => (
      <DItem key={index} title={item.name} action={this.handleKeySelect} />
    ));

  render () {
    const { data, collection } = this.props;

    return (
      <Modal hasFooter>
        <Modal.Header titleId="props-modal" onClose={this.props.onClose}>
          Create / Update property
        </Modal.Header>
        <form onSubmit={this.handleFormSubmit}>
          <Modal.Body>
            <Box top fill>
              <label htmlFor="domain"> Domain </label>
              <div className={`form-group ${!data ? 'input-group' : ''}`}>
                {!data && (
                  <div className="input-group-btn">
                    <Dropdown
                      id="props"
                      show={this.state.showDomains}
                      onHide={this.handleDomainClose}
                    >
                      <DControl> Select </DControl>
                      {this.renderDomains()}
                    </Dropdown>
                  </div>
                )}
                <input
                  readOnly={data}
                  ref="domain"
                  type="text"
                  id="domain"
                  value={this.state.domain}
                  className="bp3-input bp3-fill"
                  onChange={this.handleDomainChange}
                  autoComplete="off"
                  placeholder="...or specify new domain"
                />
              </div>
              <label htmlFor="key"> Key </label>
              <div
                className={`form-group ${
                  !data || !data.key ? 'input-group' : ''
                }`}
              >
                {(!data || !data.key) && (
                  <div className="input-group-btn">
                    <Dropdown
                      id="props"
                      show={this.state.showKeys}
                      onHide={this.handleKeysClose}
                    >
                      <DControl disabled={!collection[this.state.domain]}>
                        {' '}
                        Select{' '}
                      </DControl>
                      {collection[this.state.domain] && this.renderKeys()}
                    </Dropdown>
                  </div>
                )}
                <input
                  readOnly={data && data.key}
                  ref="key"
                  type="text"
                  id="key"
                  value={this.state.key}
                  className="bp3-input bp3-fill"
                  onChange={this.handleKeyChange}
                  autoComplete="off"
                  placeholder="...or specify new key"
                />
              </div>
              <div className="form-group">
                <label htmlFor="value"> Value </label>
                <div>
                  <textarea
                    ref="value"
                    id="value"
                    defaultValue={data ? JSON.stringify(data.value) : ''}
                    className="bp3-input bp3-fill"
                  />
                </div>
              </div>
            </Box>
          </Modal.Body>
          <Modal.Footer>
            <div className="pull-right">
              <Controls noControls grouped>
                <Control
                  label="Cancel"
                  big
                  btnStyle="default"
                  action={this.props.onClose}
                  type="button"
                />
                <Control type="submit" big label="Save" btnStyle="success" />
              </Controls>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
}
