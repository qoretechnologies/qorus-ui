/* @flow */
import { findIndex, omit, reduce, size } from 'lodash';
import trimEnd from 'lodash/trimEnd';
import trimStart from 'lodash/trimStart';

const formatFieldSource: Function = (fieldSource: string): any => {
  let newSource = fieldSource;
  newSource = trimStart(newSource, '(');
  newSource = trimEnd(newSource, ') ');

  if (newSource.indexOf('runtime') !== -1 && newSource !== '{}' && newSource !== '{},') {
    newSource = trimStart(newSource, '{');
    newSource = trimEnd(newSource, '}');
  }

  // Check if there is any code in the fieldsource
  const code = newSource.substring(newSource.lastIndexOf('"code"'), newSource.lastIndexOf('}') + 1);

  // Pull it out if there is
  if (code !== '' && code !== '{}') {
    if (newSource.startsWith('{')) {
      newSource = trimStart(newSource, '{');
      newSource = trimEnd(newSource, '{');
    }

    newSource = newSource.replace(code, '');
  }

  // Remove all spaces and quotes now that we removed code
  newSource = newSource.replace(/"/g, '').replace(/ /g, '');

  // Split the fieldsource by commas
  const sourceArray = newSource.split(',');

  const data = sourceArray
    .map((attr) => {
      if (attr === '' || attr === ' ' || attr === '{}') {
        if (code !== '' && code !== '{}') {
          return {
            key: 'code',
            value: 'Click to view code',
          };
        }

        return null;
      }

      // Split the string by key and value
      const newAttr = attr.split(':');

      // If there is no key, the key is value and key is Unknown
      if (!newAttr[1]) {
        newAttr[1] = newAttr[0];
        newAttr[0] = 'Unknown';
      }

      // Remove all quotes
      const key = newAttr[0];
      const value = newAttr[1];

      // Do not display name
      if (key === 'name') {
        return null;
      }

      return { key, value };
    })
    .filter((item) => item);

  return {
    data,
    code,
  };
};
// This functions flattens the fields, by taking all the
// deep fields from `type` and adds them right after their
// respective parent field
export const flattenFields: (
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
      if (size(field.type?.fields)) {
        // Recursively add deep fields
        res = [...res, ...flattenFields(field.type?.fields, true, name, level + 1, newPath)];
      }
      // Return the new fields
      return res;
    },
    []
  );

export const getLastChildIndex = (field: any, fields: any[]) => {
  // Only get the child index for fields
  // that actually have children
  if (size(field.type?.fields)) {
    // Get the name of the last field
    const name: string = Object.keys(field.type?.fields).find(
      (_name, index) => index === size(field.type?.fields) - 1
    );
    // Get the index of the last field in this
    // hierarchy based on the name
    return findIndex(fields, (curField) => curField.path === `${field.path}.${name}`);
  }
  // Return nothing
  return 0;
};

export const filterInternalData = (fields) => {
  return reduce(
    fields,
    (newFields, fieldData, field) => {
      return {
        ...newFields,
        [field]: {
          ...omit(fieldData, [
            'canBeNull',
            'firstCustomInHierarchy',
            'parent',
            'isChild',
            'isCustom',
            'level',
          ]),
          type: {
            ...fieldData.type,
            fields: filterInternalData(fieldData.type.fields),
          },
        },
      };
    },
    {}
  );
};

export const hasStaticDataField = (context: string) =>
  context.startsWith('$static') && !context.startsWith('$static:*');

export const getStaticDataFieldname = (context: string) => {
  return context.match(/\{([^}]+)\}/)?.[1];
};

export { formatFieldSource };
