// @flow
import { ReqoreDropdown } from '@qoretechnologies/reqore';
import { IReqoreButtonProps } from '@qoretechnologies/reqore/dist/components/Button';
import { IReqoreDropdownItem } from '@qoretechnologies/reqore/dist/components/Dropdown/list';
import includes from 'lodash/includes';
import React, { Component } from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import Box from '../../../components/box';
import { Control, Controls } from '../../../components/controls';
import Dropdown, { Control as DControl, Item as DItem } from '../../../components/dropdown';
import Modal from '../../../components/modal';

@pure(['asgasgasgasg'])
export default class extends Component {
  props: {
    onMount: Function;
    onClose: Function;
    onSubmit: Function;
    data: any;
    collection: any;
  } = this.props;

  state: {
    domain: string;
    key: string;
    showDomains: boolean;
    showKeys: boolean;
  } = {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'domain' does not exist on type 'Object'.
    domain: this.props.data ? this.props.data.domain : '',
    // @ts-ignore ts-migrate(2339) FIXME: Property 'key' does not exist on type 'Object'.
    key: this.props.data ? this.props.data.key : '',
    showDomains: false,
    showKeys: false,
  };

  // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
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

  // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
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
    // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
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

  // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
  handleKeySelect: Function = (event: EventHandler, key: string): void => {
    this.setState({ key });
  };

  // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
  handleFormSubmit = (event: EventHandler): void => {
    event.preventDefault();

    const { domain, key, value } = this.refs;
    // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'ReactInst... Remove this comment to see the full error message
    let val = value.value;

    try {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'ReactInst... Remove this comment to see the full error message
      val = JSON.parse(value.value);
    } catch (e) {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'ReactInst... Remove this comment to see the full error message
      val = value.value;
    } finally {
      this.props.onSubmit({
        // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'ReactInst... Remove this comment to see the full error message
        domain: domain.value,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'ReactInst... Remove this comment to see the full error message
        key: key.value,
        value: val,
      });

      this.props.onClose();
    }
  };

  getDomainList: Function = (value: string): Array<string> =>
    Object.keys(this.props.collection).filter((domain: string): boolean => includes(domain, value));

  getKeyList: Function = (value: string): Array<string> =>
    this.props.collection[this.state.domain].filter(
      // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
      (item: any): boolean => (value ? includes(item.name, value) : true)
    );

  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  renderDomains: Function = (): Array<React.Element<any>> =>
    this.getDomainList(this.state.domain).map((domain: string, key: number) => (
      // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
      <DItem key={key} title={domain} action={this.handleDomainSelect} />
    ));

  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  renderKeys: Function = (): Array<React.Element<any>> =>
    this.getKeyList(this.state.key).map((item: any, index: number) => (
      // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
      <DItem key={index} title={item.name} action={this.handleKeySelect} />
    ));

  render() {
    const { data, collection } = this.props;

    console.log('UPDATED');

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
                    <ReqoreDropdown<IReqoreButtonProps>
                      //@ts-ignore
                      type="button"
                      items={this.getDomainList(this.state.domain).map(
                        (domain: string): IReqoreDropdownItem => ({
                          label: domain,
                          selected: domain === this.state.domain,
                          onClick: ({ value }) => this.setState({ domain: value }),
                          value: domain,
                        })
                      )}
                    >
                      {this.state.domain || 'Please select domain'}
                    </ReqoreDropdown>
                  </div>
                )}
                <input
                  // @ts-ignore ts-migrate(2322) FIXME: Type 'Object' is not assignable to type 'boolean'.
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
                  // @ts-ignore ts-migrate(2339) FIXME: Property 'key' does not exist on type 'Object'.
                  !data || !data.key ? 'input-group' : ''
                }`}
              >
                {/* @ts-ignore ts-migrate(2339) FIXME: Property 'key' does not exist on type 'Object'. */}
                {(!data || !data.key) && (
                  <div className="input-group-btn">
                    <Dropdown id="props" show={this.state.showKeys} onHide={this.handleKeysClose}>
                      {/* @ts-ignore ts-migrate(2739) FIXME: Type '{ children: string[]; disabled: boolean; }' ... Remove this comment to see the full error message */}
                      <DControl disabled={!collection[this.state.domain]}> Select </DControl>
                      {collection[this.state.domain] && this.renderKeys()}
                    </Dropdown>
                  </div>
                )}
                <input
                  // @ts-ignore ts-migrate(2339) FIXME: Property 'key' does not exist on type 'Object'.
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
                    // @ts-ignore ts-migrate(2339) FIXME: Property 'value' does not exist on type 'Object'.
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
