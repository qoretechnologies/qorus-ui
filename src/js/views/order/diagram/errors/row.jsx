// @flow
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import lifecycle from 'recompose/lifecycle';

import { Control as Button } from '../../../../components/controls';
import { Tbody, Tr, Td } from '../../../../components/new_table';
import Date from '../../../../components/date';
import AutoComponent from '../../../../components/autocomponent';
import withModal from '../../../../hocomponents/modal';
import CSVModal from '../../errors/csv';

type Props = {
  handleCopyClick: Function,
  handleDetailClick: Function,
  severity: string,
  error: string,
  created: string,
  description?: string,
  business_error?: boolean,
  error_instanceid: number,
  info: string,
  setExpand: Function,
  expand: boolean,
  stateExpand: boolean,
  openModal: Function,
  closeModal: Function,
  onDetailClick: Function,
  onModalMount: Function,
  data: Object,
};

const ErrorRow: Function = ({
  severity,
  error,
  created,
  description,
  handleDetailClick,
  handleCopyClick,
  info,
  stateExpand,
  business_error: busErr,
}: Props): React.Element<any> => (
  <Tbody>
    <Tr>
      <Td className="narrow">
        <Button
          label={stateExpand ? 'Hide' : 'Detail'}
          btnStyle={stateExpand ? 'info' : 'none'}
          onClick={handleDetailClick}
        />
      </Td>
      <Td>{severity}</Td>
      <Td className="name">{error}</Td>
      <Td>
        <Date date={created} />
      </Td>
      <Td className="text">{description}</Td>
      <Td className="narrow">
        <AutoComponent>{busErr}</AutoComponent>
      </Td>
    </Tr>
    {stateExpand && (
      <Tr>
        <Td colspan={5} className="text wrap">
          <p>{info || 'No info'}</p>
        </Td>
        <Td className="narrow">
          <Button label="Copy" iconName="copy" onClick={handleCopyClick} />
        </Td>
      </Tr>
    )}
  </Tbody>
);

const stringifyError: Function = (data: Object): string =>
  Object.keys(data).reduce((str, key) => `${str}${key}: ${data[key]}\r\n`, '');

export default compose(
  withState('stateExpand', 'setExpand', ({ expand }: Props): boolean => expand),
  mapProps(
    ({ stateExpand, setExpand, ...rest }: Props): Props => ({
      onDetailClick: (expand): Function => setExpand((): boolean => expand),
      stateExpand,
      setExpand,
      ...rest,
    })
  ),
  lifecycle({
    componentWillReceiveProps(nextProps: Props) {
      if (this.props.expand !== nextProps.expand) {
        this.props.onDetailClick(nextProps.expand);
      }
    },
  }),
  withModal(),
  withHandlers({
    handleDetailClick: ({
      stateExpand,
      onDetailClick,
    }: Props): Function => (): void => {
      onDetailClick(!stateExpand);
    },
    handleCopyClick: ({
      openModal,
      closeModal,
      data,
      onModalMount,
    }: Props): Function => (): void => {
      openModal(
        <CSVModal
          onClose={closeModal}
          data={stringifyError(data)}
          onMount={onModalMount}
        />
      );
    },
  }),
  pure(['stateExpand'])
)(ErrorRow);
