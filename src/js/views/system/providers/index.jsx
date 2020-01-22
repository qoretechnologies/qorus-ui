import React, { useState } from 'react';
import Flex from '../../../components/Flex';
import Headbar from '../../../components/Headbar';
import { Breadcrumbs, Crumb } from '../../../components/breadcrumbs';
import { injectIntl, FormattedMessage } from 'react-intl';
import Box from '../../../components/box';
import DataProvider from './selector';
import size from 'lodash/size';
import reduce from 'lodash/reduce';
import ProvidersTable from './table';

const ProvidersView = ({}) => {
  const [record, setRecord] = useState(null);
  const [data, setData] = useState(null);

  // This functions flattens the fields, by taking all the
  // deep fields from `type` and adds them right after their
  // respective parent field
  const flattenFields: (
    fields: any,
    isChild?: boolean,
    parent?: string,
    level?: number,
    path?: string
  ) => any[] = (fields, isChild = false, parent, level = 0, path = '') =>
    reduce(
      fields,
      (newFields, field, name) => {
        let res = [...newFields];
        // Build the path for the child fields
        const newPath = level === 0 ? name : `${path}.${name}`;
        const parentPath = level !== 0 && `${path}`;
        // Add the current field
        res = [
          ...res,
          {
            name,
            ...{ ...field, isChild, level, parent, path: newPath, parentPath },
          },
        ];
        // Check if this field has hierarchy
        if (size(field.type.fields)) {
          // Recursively add deep fields
          res = [
            ...res,
            ...flattenFields(field.type.fields, true, name, level + 1, newPath),
          ];
        }
        // Return the new fields
        return res;
      },
      []
    );

  console.log(record, flattenFields(record));

  return (
    <Flex>
      <Headbar>
        <Breadcrumbs>
          <Crumb active>
            <FormattedMessage id="Providers" />
          </Crumb>
        </Breadcrumbs>
      </Headbar>
      <Box fill top scrollY>
        <DataProvider
          title="Select provider"
          setRecord={setRecord}
          setData={setData}
          record={record}
        />
        {record && <ProvidersTable fields={flattenFields(record)} />}
      </Box>
    </Flex>
  );
};

export default ProvidersView;
