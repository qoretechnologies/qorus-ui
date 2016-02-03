import React, { Component, PropTypes } from 'react';
import Col from './col';
import Cell from './cell';
import THead from './thead';
import TBody from './tbody';


import { pureRenderOmit } from '../utils';


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
@pureRenderOmit('children')
export default class Table extends Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired,
    data: PropTypes.array.isRequired,
    identifier: PropTypes.func,
    shouldHighlight: PropTypes.func,
    onRowClick: PropTypes.func
  };

  static defaultProps = {
    shouldHighlight: () => false,
    onRowClick: () => undefined
  };

  render() {
    const {
      data, identifier, shouldHighlight, onRowClick, children, ...props
    } = this.props;

    return (
      <table {...props}>
        <THead data={data}>
          {children}
        </THead>
        <TBody
          data={data}
          identifier={identifier}
          shouldHighlight={shouldHighlight}
          onRowClick={onRowClick}
        >
          {children}
        </TBody>
      </table>
    );
  }
}


export { Col, Cell, THead, TBody };
