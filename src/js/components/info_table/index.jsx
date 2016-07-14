import React, { Component, PropTypes } from 'react';

import Table, { Section, Row, Cell } from '../table';

import AutoComponent from '../autocomponent';

import _ from 'lodash';
import { pureRender } from '../utils';

/**
 * Object with attribute name and value.
 *
 * @typedef {{ attr: string, value: * }} AttrValuePair
 */

/**
 * Two-column table with name and value in each column.
 *
 * Name-value pairs are retrived by iterating over `object`
 * prop. Optionally, it is possible to either omit or pick particular
 * object properties by listen them either in `omit` or `pick` prop.
 */
@pureRender
export default class InfoTable extends Component {
  static propTypes = {
    object: PropTypes.object.isRequired,
    omit: PropTypes.array,
    pick: PropTypes.array,
  };

  componentWillMount() {
    this.renderRows = ::this.renderRows;
    this.renderTBody = ::this.renderTBody;
    this.renderCells = ::this.renderCells;
  }

  /**
   * Returns object attribute filter based on `omit` or `pick` props.
   *
   * @return {function(attr: string): boolean}
   */
  getAttrFilter() {
    if (this.props.omit) return attr => this.props.omit.indexOf(attr) < 0;
    if (this.props.pick) return attr => this.props.pick.indexOf(attr) >= 0;
    return () => true;
  }

  /**
   * Returns attribute-value pairs from `object` props.
   *
   * It takes into account either omitted or picked attributes if set.
   *
   * @return {Array<AttrValuePair>}
   * @see getAttrFilter
   */
  getData() {
    return Object.keys(this.props.object).
      filter(this.getAttrFilter()).
      map(attr => ({
        attr,
        value: this.props.object[attr],
      }));
  }

  /**
   * Returns value representation.
   *
   * Complex value are wrapped in `pre` tag after being stringified
   * with nice indentation.
   *
   * @param {*} value
   * @return {ReactElement}
   * @see COMPLEX_VALUE_INDENT
   */
  renderValue(value) {
    return <AutoComponent>{ value }</AutoComponent>;
  }

  /**
   * Yields cells with capitalized attribute name and its value.
   *
   * @param {string} attr
   * @param {*} value
   * @return {Generator<ReactElement>}
   * @see renderValue
   */
  *renderCells({ attr, value }) {
    yield (
      <Cell tag="th">{_.capitalize(attr)}</Cell>
    );

    yield (
      <Cell>{this.renderValue(value)}</Cell>
    );
  }

  /**
   * Yields rows for table body.
   *
   * @param {Array<AttrValuePair>} data
   * @return {Generator<ReactElement>}
   * @see renderCells
   */
  *renderRows(data) {
    for (const attr of data) {
      yield (
        <Row data={attr} cells={this.renderCells} />
      );
    }
  }

  /**
   * Yields table body section.
   *
   * @param {Array<AttrValuePair>} data
   * @return {Generator<ReactElement>}
   * @see renderRows
   */
  *renderTBody(data) {
    yield (
      <Section type="body" data={data} rows={this.renderRows} />
    );
  }

  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    return (
      <Table
        data={this.getData()}
        sections={this.renderTBody}
        className="table table-condensed table-striped table--info"
      />
    );
  }
}
