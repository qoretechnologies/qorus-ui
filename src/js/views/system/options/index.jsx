import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { flowRight } from 'lodash';
import sync from '../../../hocomponents/sync';
import { compose } from 'redux';

import actions from 'store/api/actions';
import * as ui from 'store/ui/actions';

import { sortTable } from '../../../helpers/table';
import { findBy } from '../../../helpers/search';
import { goTo } from '../../../helpers/router';
import { hasPermission } from '../../../helpers/user';

import Badge from '../../../components/badge';
import Table, { Section, Row, Cell } from '../../../components/table';
import Toolbar from '../../../components/toolbar';
import Search from '../../../components/search';
import OptionModal from './modal';
import { Control } from '../../../components/controls';

const sortOptions = sortData => collection => sortTable(collection, sortData);
const filterOptions = search => collection => (
  findBy(['name', 'default', 'expects', 'value', 'description'], search, collection)
);

const optionsSelector = state => state.api.systemOptions;
const sortSelector = state => state.ui.options;
const searchSelector = (state, props) => props.location.query.q;
const userSelector = state => state.api.currentUser;

const collectionSelector = createSelector(
  [
    optionsSelector,
    sortSelector,
    searchSelector,
  ], (options, sortData, search) => flowRight(
    sortOptions(sortData),
    filterOptions(search)
  )(options.data)
);

const viewSelector = createSelector(
  [
    optionsSelector,
    collectionSelector,
    sortSelector,
    userSelector,
  ],
  (options, collection, sortData, user) => ({
    collection,
    options,
    sortData,
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
    user: PropTypes.object,
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

  handleSortChange = (sortChange) => {
    this.props.sort(sortChange);
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
    const { sortData } = this.props;

    yield (
      <Cell
        tag="th"
        name="status"
        sortData={sortData}
        onSortChange={this.handleSortChange}
      >
        Status
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        name="name"
        sortData={sortData}
        onSortChange={this.handleSortChange}
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
        onSortChange={this.handleSortChange}
      >
        Default Value
      </Cell>
    );

    yield (
      <Cell
        tag="th"
        name="value"
        sortData={sortData}
        onSortChange={this.handleSortChange}
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
      sort: ui.options.sort,
    }
  ),
  sync('options'),
)(Options);
