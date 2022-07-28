import { Button, ButtonGroup, ControlGroup } from '@blueprintjs/core';
import size from 'lodash/size';
import { FunctionComponent } from 'react';
import styled from 'styled-components';
import AutoField from './auto';
import SelectField from './select';

type IPair = {
  id: number;
  value: string;
  name: string;
};

export const StyledPairField = styled.div`
  margin-bottom: 10px;
`;

const OptionHashField: FunctionComponent<any> = ({
  name,
  onChange,
  value = [{ id: 1, value: '', name: '' }],
  items,
  options,
}) => {
  const changePairData: (index: number, key: string, val: any) => void = (index, key, val) => {
    const newValue = [...value];
    // Get the pair based on the index
    const pair: IPair = newValue[index];
    // Update the field
    pair[key] = val;
    // Update the pairs
    onChange(name, newValue);
  };

  const handleAddClick: () => void = () => {
    onChange(name, [...value, { id: size(value) + 1, value: '', name: '' }]);
  };

  const handleRemoveClick: (id: number) => void = (id) => {
    // Remove the selected pair
    onChange(
      name,
      value.filter((_p: IPair, index: number) => id !== index)
    );
  };

  const getNameType: (name: string) => string = (name) => {
    // Find the option and return it's type
    return options[name].type;
  };

  // Filter the items
  const filteredItems = items.filter((item) => !value.find((val) => val.name === item.name));

  return (
    <>
      {value.map((pair: IPair, index: number) => (
        <StyledPairField key={pair.name}>
          <div>
            <ControlGroup fill>
              <Button text={`${index + 1}.`} />
              <SelectField
                name="name"
                value={pair.name}
                defaultItems={filteredItems}
                onChange={(fieldName: string, value: string) => {
                  changePairData(index, fieldName, value);
                }}
                fill
              />
              {pair.name ? (
                <AutoField
                  defaultType={getNameType(pair.name)}
                  name="value"
                  value={pair.value}
                  onChange={(fieldName: string, value: string): void => {
                    changePairData(index, fieldName, value);
                  }}
                  fill
                />
              ) : null}
              {index !== 1 && (
                <Button icon={'trash'} intent="danger" onClick={() => handleRemoveClick(index)} />
              )}
            </ControlGroup>
          </div>
        </StyledPairField>
      ))}
      {size(options) !== 0 && size(value) !== size(options) && (
        <ButtonGroup fill>
          <Button text={'Add New'} icon={'add'} onClick={handleAddClick} />
        </ButtonGroup>
      )}
    </>
  );
};

export default OptionHashField;
