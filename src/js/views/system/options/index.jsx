import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { flowRight } from 'lodash';
import { compose } from 'redux';
import sync from '../../../hocomponents/sync';
import { sortDefaults } from '../../../constants/sort';

import actions from 'store/api/actions';

import { findBy } from '../../../helpers/search';
import { goTo } from '../../../helpers/router';
import { hasPermission } from '../../../helpers/user';
import sort from '../../../hocomponents/sort';

import Badge from '../../../components/badge';
import Table, { Section, Row, Cell } from '../../../components/table';
import Toolbar from '../../../components/toolbar';
import Search from '../../../components/search';
import OptionModal from './modal';
import { Control } from '../../../components/controls';

const filterOptions = search => collection => (
  findBy(['name', 'default', 'expects', 'value', 'description'], search, collection)
);

const optionsSelector = state => state.api.systemOptions;
const searchSelector = (state, props) => props.location.query.q;
const userSelector = state => state.api.currentUser;

const collectionSelector = createSelector(
  [
    optionsSelector,
    searchSelector,
  ], (options, search) => flowRight(
    filterOptions(search)
  )(options.data)
);

const viewSelector = createSelector(
  [
    optionsSelector,
    collectionSelector,
    userSelector,
  ],
  (options, collection, user) => ({
    collection,
    options,
    user,
  })
);

class Options extends Component {
  static propTypes = {
    load: PropTypes.func.isRequired,
    collection: PropTypes.array,
    params: PropTypes.object,
    location: PropTypes.object,
    route: PropTypes.object,
    sortData: PropTypes.object,
    onSortChange: PropTypes.func,
    user: PropTypes.object,
    setOption: PropTypes.func,
  };

  static contextTypes = {
    openModal: PropTypes.func,
    closeModal: PropTypes.func,
    router: PropTypes.object,
  };

  componentWillMount() {
    this.props.load();

    this.renderCells = ::this.renderCells;
    this.renderRows = ::this.renderRows;
    this.renderHeaders = ::this.renderHeaders;
    this.renderHeadingRow = ::this.renderHeadingRow;
    this.renderSections = ::this.renderSections;
  }

  handleModalClose = () => {
    this.context.closeModal(this._modal);
  };

  /**
   * Applies the current filter to the URL
   *
   * @param {String} q
   */
  handleSearchChange = (q) => {
    goTo(
      this.context.router,
      'system/options',
      `system/${this.props.route.path}`,
      this.props.params,
      {},
      { q },
    );
  };

  handleEditClick = (model) => () => {
    this._modal = (
      <OptionModal
        onCloseClick={this.handleModalClose}
        onSaveClick={this.handleSaveClick}
        model={model}
      />
    );

    this.context.openModal(this._modal);
  };

  handleSaveClick = async (model, value) => {
    await this.props.setOption(model.name, value);
    this.context.closeModal(this._modal);
  };

  *renderHeaders() {
    const { sortData, onSortChange: handleSortChange } = this.props;

    yield (
      <Cell
        tag="th"
        name="status"
        sortData={sortData}
        onSortChange={handleSortChange}
      >
        Status
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        name="name"
        sortData={sortData}
        onSortChange={handleSortChange}
      >
        Name
      </Cell>
    );

    yield (
      <Cell
        tag="th"
      >
        Type
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        name="default"
        sortData={sortData}
        onSortChange={handleSortChange}
      >
        Default Value
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        name="value"
        sortData={sortData}
        onSortChange={handleSortChange}
      >
        Current Value
      </Cell>
    );

    yield (
      <Cell
        tag="th"
      />
    );
  }

  *renderCells(model) {
    yield (
      <Cell>
        { model.status === 'locked' &&
        <i className="fa fa-lock" />
        }
        { model.status === 'unlocked' &&
        <i className="fa fa-unlock" />
        }
      </Cell>
    );

    yield (
      <Cell className="name">{model.name}</Cell>
    );

    yield (
      <Cell>
        <Badge
          val="W"
          label={model.workflow ? 'success' : 'default'}
        />
        {' '}
        <Badge
          val="S"
          label={model.service ? 'success' : 'default'}
        />
        {' '}
        <Badge
          val="J"
          label={model.job ? 'success' : 'default'}
        />
      </Cell>
    );

    yield (
      <Cell>{JSON.stringify(model.default)}</Cell>
    );

    yield (
      <Cell>{JSON.stringify(model.value)}</Cell>
    );

    const handleClick = this.handleEditClick(model);
    const user = this.props.user.data;

    yield (
      <Cell>
        {model.status === 'unlocked' && hasPermission(user.permissions, 'OPTION-CONTROL') && (
          <Control
            icon="edit"
            action={handleClick}
            btnStyle="success"
            className="options-edit"
          />
        )}
      </Cell>
    );
  }

  /**
   * Yields row for table head.
   *
   * @return {Generator<ReactElement>}
   * @see renderHeadings
   */
  *renderHeadingRow() {
    yield (
      <Row cells={this.renderHeaders} />
    );
  }

  *renderRows(collection) {
    for (const model of collection) {
      yield (
        <Row
          key={model.name}
          data={model}
          cells={this.renderCells}
        />
      );
    }
  }

  *renderSections(collection) {
    yield (
      <Section type="head" data={collection} rows={this.renderHeadingRow} />
    );

    yield (
      <Section type="body" data={collection} rows={this.renderRows} />
    );
  }

  render() {
    const { collection, location } = this.props;

    return (
      <div className="tab-pane active">
        <div className="container-fluid">
          <Toolbar>
            <Search
              defaultValue={location.query.q}
              onSearchUpdate={this.handleSearchChange}
            />
          </Toolbar>
          <Table
            data={ collection }
            className="table table-striped table-condensed table--data"
            sections={this.renderSections}
          />
        </div>
      </div>
    );
  }
}

export default compose(
  connect(
    viewSelector,
    {
      setOption: actions.systemOptions.setOption,
      load: actions.systemOptions.fetch,
    }
  ),
  sort('options', 'collection', sortDefaults.options),
  sync('options'),
)(Options);
