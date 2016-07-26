/* @flow */
import React from 'react';
import { Row } from '../../components/table';

type Props = {
  id: string | number,
  onClick: () => void,
  children: any,
  type: string,
  active: () => boolean,
}

const LibraryRow: Function = (
  { id, onClick, children, type, active }: Props
): React.Element<any> => {
  const handleClick: Function = (): void => {
    onClick(id, type);
  };

  return (
    <Row
      onClick={handleClick}
      className={active(id, type) ? 'info' : ''}
    >
      { children }
    </Row>
  );
};

export default LibraryRow;
