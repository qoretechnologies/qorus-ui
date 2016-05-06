import React, { Component, PropTypes } from 'react';
import { goTo } from '../helpers/router';
import { getCSVHeaders } from '../helpers/table';

import Modal from '../components/modal';

export default class extends Component {
  static propTypes = {
    route: PropTypes.object,
    dispatch: PropTypes.func,
    location: PropTypes.object,
    params: PropTypes.object,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
    openModal: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.setUp();
  }

  componentWillReceiveProps(next) {
    if (this.props.route.name !== next.route.name) {
      this.setUp();
    }
  }

  setUp = () => {
    this.setState({
      filterFn: null,
      selected: 'none',
      selectedData: {},
      name: this.props.route.name.toLowerCase(),
    });
  };

  setSelectedData = (selectedData) => {
    this.setState({
      selectedData,
    });
  };

  getActiveRow = (data) => {
    if (!this.props.params.detailId) return null;

    return data.find(d => d.id === parseInt(this.props.params.detailId, 10));
  };

  /**
   * Generates the CSV string from the collection
   * @param {Array<Object>} collection
   * @param {String} type
   * @returns {String}
   */
  generateCSV = (collection, type) => {
    const headers = getCSVHeaders(type);

    let content = Object.keys(headers).reduce((str, h) => {
      return str === '' ? headers[h] : `${str};${headers[h]}`;
    }, '');

    for (const item of collection) {
      content += `\n${Object.keys(headers).reduce((str, h) => {
        const value = item[h] || 0;

        return str === '' ? value : `${str};${value}`;
      }, '')}`;
    }

    return content;
  };

  clearSelection = () => {
    this.setSelectedData({});
    this.handleDataFilterChange('none');
  };

  /**
   * Handles the click on the dropdowns checkbox
   *
   * @param {Function} filterFn
   */
  handleFilterClick = (filterFn) => {
    this.setState({
      filterFn,
    });
  };

  /**
   * Changes the state of what workflows are selected
   * Used by the dropdown checkbox in Toolbar
   *
   * @param {String} selected
   */
  handleDataFilterChange = (selected) => {
    this.setState({
      selected,
    });
  };

  /**
   * Applies the current filter to the URL
   *
   * @param {String} q
   */
  handleSearchChange = (q) => {
    goTo(
      this.context.router,
      this.state.name,
      this.props.route.path,
      this.props.params,
      {},
      { q },
    );
  };

  handlePaneClose = () => {
    goTo(
      this.context.router,
      this.state.name,
      this.props.route.path,
      this.props.params,
      { filter: this.props.params.filter, detailId: null, tabId: null },
      this.props.location.query
    );
  };

  /**
   * Handles selecting/deselecting all workflows
   */
  handleAllClick = () => {
    if (this.state.selected === 'none' || this.state.selected === 'some') {
      this.handleFilterClick(() => true);
    } else {
      this.handleNoneClick();
    }
  };

  /**
   * Handles deselecting all workflows
   */
  handleNoneClick = () => {
    this.handleFilterClick(() => false);
  };

  /**
   * Handles inverting selected workflows
   */
  handleInvertClick = () => {
    this.handleFilterClick((item, selectedData) => !selectedData[item.id]);
  };

  selectCSVContent = () => {
    document.getElementById('csv-text').select();
  };

  handleCSVClick = (collection, type) => {
    this._modal = (
      <Modal
        onMount={this.selectCSVContent}
      >
        <Modal.Header
          onClose={this.handleCSVCloseClick}
        >
          Copy table
          <small> (Press ⌘ + c)</small>
        </Modal.Header>
        <Modal.Body>
          <textarea
            rows="12"
            readOnly
            id="csv-text"
            className="form-control"
            value={this.generateCSV(collection, type)}
          />
        </Modal.Body>
      </Modal>
    );

    this.context.openModal(this._modal);
  };

  handleCSVCloseClick = () => {
    this.context.closeModal(this._modal);
  };

  render() {
    const View = this.props.route.view;

    return (
      <View
        filterFn={this.state.filterFn}
        onSearchChange={this.handleSearchChange}
        onFilterClick={this.handleFilterClick}
        onDataFilterChange={this.handleDataFilterChange}
        clearSelection={this.clearSelection}
        setSelectedData={this.setSelectedData}
        onBatchAction={this.handleBatchAction}
        selectedData={this.state.selectedData}
        selected={this.state.selected}
        onPaneClose={this.handlePaneClose}
        getActiveRow={this.getActiveRow}
        onAllClick={this.handleAllClick}
        onNoneClick={this.handleNoneClick}
        onInvertClick={this.handleInvertClick}
        onCSVClick={this.handleCSVClick}
        {...this.props}
      />
    );
  }
}
