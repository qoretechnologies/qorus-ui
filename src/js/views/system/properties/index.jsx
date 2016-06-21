import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import actions from 'store/api/actions';

import Prop from './prop';
import { Control as Button } from 'components/controls';
import Search from 'components/search';
import Loader from 'components/loader';
import Modal from './modal';

import { goTo } from 'helpers/router';
import { hasPermission } from 'helpers/user';
import { includes } from 'lodash';

const viewSelector = createSelector(
  [
    state => state.api.props,
    state => state.api.currentUser,
  ],
  (properties, user) => ({
    properties,
    user,
  })
);

@connect(viewSelector)
export default class PropertiesView extends Component {
  static propTypes = {
    properties: PropTypes.object,
    user: PropTypes.object,
    dispatch: PropTypes.func,
    params: PropTypes.object,
    location: PropTypes.object,
    route: PropTypes.object,
  };

  static contextTypes = {
    router: PropTypes.object,
    openModal: PropTypes.func,
    closeModal: PropTypes.func,
  };

  componentWillMount() {
    this.props.dispatch(actions.props.fetch());
  }

  handleSearchUpdate = (q) => {
    goTo(
      this.context.router,
      'system/props',
      'system/props',
      this.props.params,
      {},
      { q }
    );
  };

  handleAddClick = (data = {}) => {
    this._modal = (
      <Modal
        onClose={this.handleModalClose}
        onSubmit={this.handleFormSubmit}
        data={data}
      />
    );

    this.context.openModal(this._modal);
  };

  handleModalClose = () => {
    this.context.closeModal(this._modal);
  };

  handleFormSubmit = (data) => {
    this.props.dispatch(
      actions.props.addProp(this.props.properties.data, data)
    );
  };

  handleDeleteClick = (prop) => {
    this.props.dispatch(
      actions.props.deleteProp(this.props.properties.data, prop)
    );
  };

  renderProperties() {
    const filter = this.props.location.query.q;
    return Object.keys(this.props.properties.data).map((p, key) => {
      let manage = hasPermission(
        this.props.user.data.permissions,
        ['SERVER-CONTROL']
      );
      const data = this.props.properties.data[p];
      const filtered = Object.keys(data).reduce((n, k) => {
        if (!filter || (includes(p, filter) || includes(k, filter) || includes(data[k], filter))) {
          return Object.assign(n, { [k]: data[k] });
        }

        return n;
      }, {});

      if (!Object.keys(filtered).length) return undefined;

      manage = p !== 'omq' && manage;

      return (
        <Prop
          data={filtered}
          filter={this.props.location.query.q}
          title={p}
          manage={manage}
          key={key}
          onDelete={this.handleDeleteClick}
          onEdit={this.handleAddClick}
        />
      );
    });
  }

  renderAddButton() {
    if (!hasPermission(this.props.user.data.permissions, [
      'SERVER-CONTROL',
    ])) return undefined;

    return (
      <Button
        label="Add property"
        big
        btnStyle="success"
        action={this.handleAddClick}
        className="pull-left"
        icon="plus"
      />
    );
  }

  render() {
    if (!this.props.properties.sync) return <Loader />;

    return (
      <div className="tab-pane active">
        <div className="container-fluid">
          { this.renderAddButton() }
          <Search
            onSearchUpdate={this.handleSearchUpdate}
            defaultValue={this.props.location.query.q}
          />
        </div>
        { this.renderProperties() }
      </div>
    );
  }
}
