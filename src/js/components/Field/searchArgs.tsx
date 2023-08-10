import { ReqoreButton, ReqoreControlGroup, ReqoreMessage } from '@qoretechnologies/reqore';
import { reduce, size } from 'lodash';
import React, { useEffect, useState } from 'react';
import settings from '../../settings';
import { get } from '../../store/api/utils';
import { TRecordType } from '../DataproviderSelector';
import Spacer from '../Spacer';
import SubField from './subfield';
import Options, { IOptions, IOptionsSchema } from './systemOptions';

export interface ISearchArgsProps {
  value?: IOptions | IOptions[];
  asList?: boolean;
  type: TRecordType;
  url: string;
  onChange: (name: string, value?: IOptions | IOptions[]) => void;
  hasOperators?: boolean;
  readOnly?: boolean;
}

export const RecordQueryArgs = ({
  value,
  url,
  onChange,
  type,
  hasOperators,
  asList,
  readOnly,
}: ISearchArgsProps) => {
  const [options, setOptions] = React.useState<any>(undefined);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      // Set fields and operators to undefined
      setOptions(undefined);
      // Fetch the fields and operators
      const fieldsData = await get(`${settings.REST_BASE_URL}/${url}/record`);
      // Check if there is an error
      if (fieldsData.err) {
        setError(fieldsData);
      }
      // Set the data
      setOptions(fieldsData);
    })();
  }, [url]);

  if (!size(options)) {
    return <p>{'Loading arguments...'}</p>;
  }

  if (error) {
    return (
      <ReqoreMessage intent="danger" inverted>
        {error.desc}
      </ReqoreMessage>
    );
  }

  const transformedOptions: IOptionsSchema =
    options &&
    reduce(
      options,
      (newOptions: IOptionsSchema, optionData, optionName): IOptionsSchema => ({
        ...newOptions,
        [optionName]: {
          type: optionData.type.base_type,
          desc: optionData.desc,
        },
      }),
      {}
    );

  if (asList) {
    return (
      <>
        {value &&
          (value as IOptions[]).map((options: IOptions, index: number) => (
            <SubField
              title={`${'Record'} ${index + 1}`}
              key={index}
              subtle
              onRemove={
                !readOnly
                  ? () => {
                      // Filter out the items from value with this index
                      onChange(
                        `${type}_args`,
                        ((value || []) as IOptions[]).filter(
                          (_options: IOptions, idx: number) => idx !== index
                        )
                      );
                    }
                  : undefined
              }
            >
              <Options
                onChange={(name, newOptions?: IOptions) => {
                  const newValue = [...(value as IOptions[])];
                  // Update the field
                  newValue[index] = newOptions;
                  // Update the pairs
                  onChange(name, newValue);
                }}
                name={`${type}_args`}
                value={options}
                operatorsUrl={hasOperators ? `${url}/search_operators?context=ui` : undefined}
                options={transformedOptions}
                placeholder={'Add argument'}
                noValueString={'No argument'}
                readOnly={readOnly}
              />
            </SubField>
          ))}
        <Spacer size={15} />
        {!readOnly && (
          <ReqoreControlGroup fluid style={{ marginBottom: '10px' }}>
            <ReqoreButton
              icon="AddBoxLine"
              onClick={() => onChange(`${type}_args`, [...((value || []) as IOptions[]), {}])}
            >
              Add another record
            </ReqoreButton>
          </ReqoreControlGroup>
        )}
      </>
    );
  }

  return (
    <Options
      onChange={onChange}
      name="search_args"
      value={value as IOptions}
      operatorsUrl={hasOperators ? `${url}/search_operators?context=ui` : undefined}
      options={transformedOptions}
      placeholder={'Add argument'}
      noValueString={'No arguments added yet. At least 1 search arg is required.'}
      readOnly={readOnly}
    />
  );
};
