import React, { Component, PropTypes } from 'react';
import { pureRender } from '../utils';
import Col from './col';
import Cell from './cell';
import THead from './thead';
import TBody from './tbody';


/**
 * Combining table component.
 *
 * Delegates data rendering to THead and TBody components. It passes
 * Col specs to both table section components. It also passes
 * onRowClick to TBody.
 *
 * Every other prop apart from children, data and onRowClick is
 * applied to table element directly.
 */
@pureRender
export default class Table extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    onRowClick: PropTypes.func
  }

  static defaultProps = {
    onRowClick: () => {}
  }

  render() {
    const { data, onRowClick, children, ...props } = this.props;

    return (
      <table {...props}>
        <THead data={data}>
          {React.Children.toArray(children)}
        </THead>
        <TBody data={data} onRowClick={onRowClick}>
          {React.Children.toArray(children)}
        </TBody>
      </table>
    );
  }
}


export { Col, Cell, THead, TBody };
