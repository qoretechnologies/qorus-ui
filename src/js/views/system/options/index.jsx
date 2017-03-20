import React, { Component } from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { flowRight } from 'lodash';
import { compose } from 'redux';
import sync from '../../../hocomponents/sync';
import { sortDefaults } from '../../../constants/sort';

import actions from 'store/api/actions';

import { findBy } from '../../../helpers/search';
import { hasPermission } from '../../../helpers/user';
import sort from '../../../hocomponents/sort';
import search from '../../../hocomponents/search';
import modal from '../../../hocomponents/modal';
import Badge from '../../../components/badge';
import Table, { Section, Row, Cell } from '../../../components/table';
import Toolbar from '../../../components/toolbar';
import Search from '../../../containers/search';
import OptionModal from './modal';
import { Control } from '../../../components/controls';
import Shorten from '../../../components/shorten';
import Icon from '../../../components/icon';
import { querySelector, resourceSelector } from '../../../selectors';

const filterOptions = srch => collection => (
  findBy(['name', 'default', 'expects', 'value', 'description'], srch, collection)
);

const collectionSelector = createSelector(
  [
    resourceSelector('systemOptions'),
    querySelector('q'),
  ], (options, s) => flowRight(
    filterOptions(s)
  )(options.data)
);

const viewSelector = createSelector(
  [
    resourceSelector('systemOptions'),
    collectionSelector,
    resourceSelector('currentUser'),
    querySelector('q'),
  ],
  (options, collection, user, query) => ({
    collection,
    options,
    user,
    query,
  })
);

@compose(
  connect(
    viewSelector,
    {
      setOption: actions.systemOptions.setOption,
      load: actions.systemOptions.fetch,
    }
  ),
  sort('options', 'collection', sortDefaults.options),
  sync('options'),
  search(),
  modal(),
)
export default class Options extends Component {
  props: {
    load: Function,
    collection: Array<Object>,
    params: Object,
    sortData: Object,
    onSortChange: Function,
    user: Object,
    setOption: Function,
    onSearchChange: Function,
    defaultSearchValue: Function,
    openModal: Function,
    closeModal: Function,
  };

  componentWillMount() {
    this.props.load();

    this.renderCells = ::this.renderCells;
    this.renderRows = ::this.renderRows;
    this.renderHeaders = ::this.renderHeaders;
    this.renderHeadingRow = ::this.renderHeadingRow;
    this.renderSections = ::this.renderSections;
  }

  handleEditClick = (model) => () => {
    this.props.openModal(
      <OptionModal
        onCloseClick={this.props.closeModal}
        onSaveClick={this.handleSaveClick}
        model={model}
      />
    );
  };

  handleSaveClick = async (model, value) => {
    await this.props.setOption(model.name, value);
    this.props.closeModal();
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
        { model.status === 'locked' ? (
          <Icon icon="lock" tooltip="Option locked" />
        ) : (
          <Icon icon="unlock" tooltip="Option unlocked" />
        )}
      </Cell>
    );

    yield (
      <Cell className="name nowrap">{model.name}</Cell>
    );

    yield (
      <Cell className="nowrap">
        <Badge
          title="Workflow"
          val="W"
          label={model.workflow ? 'checked' : 'unchecked'}
        />
        {' '}
        <Badge
          title="Service"
          val="S"
          label={model.service ? 'checked' : 'unchecked'}
        />
        {' '}
        <Badge
          title="Job"
          val="J"
          label={model.job ? 'checked' : 'unchecked'}
        />
      </Cell>
    );

    yield (
      <Cell>{JSON.stringify(model.default)}</Cell>
    );

    yield (
      <Cell><Shorten>{JSON.stringify(model.value)}</Shorten></Cell>
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
            title="Edit option"
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
    const { collection, defaultSearchValue, onSearchChange } = this.props;

    return (
      <div className="tab-pane active">
        <div className="container-fluid">
          <Toolbar>
            <Search
              defaultValue={defaultSearchValue}
              onSearchUpdate={onSearchChange}
              resource="options"
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
