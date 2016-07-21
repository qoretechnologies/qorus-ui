import React from 'react';
import { Row } from '../../components/table';

type Props = {
  id: string | number,
  onClick: () => void,
  children: any,
}

const LibraryRow: Function = ({ id, onClick, children }: Props): React.Element<any> => {
  const handleClick: Function = (): void => {
    onClick(id);
  };

  return (
    <Row onClick={handleClick}>
      { children }
    </Row>
  );
};

export default LibraryRow;
