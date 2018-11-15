/* @flow */
import React, { Component } from 'react';

import { Table, Tbody, Tr, Th, Td } from '../new_table';

import AutoComponent from '../autocomponent';

import _ from 'lodash';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

@onlyUpdateForKeys(['object', 'omit', 'pick'])
export default class InfoTable extends Component {
  props: {
    object: Object,
    omit?: Array<string | number>,
    pick?: Array<string | number>,
  };

  /**
   * Returns object attribute filter based on `omit` or `pick` props.
   *
   * @return {function(attr: string): boolean}
   */
  getAttrFilter(): Function {
    const { omit = [], pick = [] } = this.props;
    if (omit.length > 0) return attr => omit.indexOf(attr) < 0;
    if (pick.length > 0) return attr => pick.indexOf(attr) >= 0;
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
  getData(): Array<Object> {
    return Object.keys(this.props.object)
      .filter(this.getAttrFilter())
      .map(attr => ({
        attr,
        value: this.props.object[attr],
      }));
  }

  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render(): React.Element<Table> {
    return (
      <Table condensed striped info>
        <Tbody>
          {this.getData().map(
            (datum: Object): React.Element<Tr> => (
              <Tr>
                <Th>{_.upperFirst(datum.attr.replace(/_/g, ' '))}</Th>
                <Td>
                  <AutoComponent>{datum.value}</AutoComponent>
                </Td>
              </Tr>
            )
          )}
        </Tbody>
      </Table>
    );
  }
}
