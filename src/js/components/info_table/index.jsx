import React, { Component, PropTypes } from 'react';


import Table, { Col } from '../table';


import _ from 'lodash';
import { pureRender } from '../utils';


/**
 * Object with attribute name and value.
 *
 * @typedef {{ attr: string, value: * }} AttrValuePair
 */


/**
 * Indent value for stringified complex values.
 */
const COMPLEX_VALUE_INDENT = 4;


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
        attr: attr,
        value: this.props.object[attr],
      }));
  }


  /**
   * Returns name column properties.
   *
   * @param {AttrValuePair} rec
   * @return {{ name: string }}
   */
  nameColProps(rec) {
    return { name: _.capitalize(rec.attr) };
  }


  /**
   * Returns value column properties.
   *
   * @param {AttrValuePair} rec
   * @return {{ value: ReactNode }}
   * @see renderValue
   */
  valueColProps(rec) {
    return { value: this.renderValue(rec.value) };
  }


  /**
   * Returns value representation.
   *
   * Complex value are wrapped in `pre` tag after being stringified
   * with nice indentation.
   *
   * @param {*} val
   * @return {ReactNode}
   * @see COMPLEX_VALUE_INDENT
   */
  renderValue(val) {
    switch (typeof val) {
      case 'object':
        return val ?
          <pre>{JSON.stringify(val, null, COMPLEX_VALUE_INDENT)}</pre> :
          '';
      default:
        return `${val}`;
    }
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
        className="table table-condensed table-striped table--info"
      >
        <Col
          comp="th"
          field="name"
          props={::this.nameColProps}
        />
        <Col
          field="value"
          props={::this.valueColProps}
        />
      </Table>
    );
  }
}
