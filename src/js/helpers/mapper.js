/* @flow */
import trimStart from 'lodash/trimStart';
import trimEnd from 'lodash/trimEnd';

const formatFieldSource: Function = (fieldSource: string): Object => {
  let newSource = fieldSource;
  newSource = trimStart(newSource, '{');
  newSource = trimEnd(newSource, '}');
  newSource = trimStart(newSource, '(');
  newSource = trimEnd(newSource, ') ');

  if (
    newSource.indexOf('runtime') !== -1 &&
    newSource !== '{}' &&
    newSource !== '{},'
  ) {
    newSource = trimStart(newSource, '{');
    newSource = trimEnd(newSource, '}');
  }

  // Check if there is any code in the fieldsource
  const code = newSource.substring(
    newSource.lastIndexOf('"code"'),
    newSource.lastIndexOf('}') + 1
  );

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
    .map(attr => {
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
    .filter(item => item);

  return {
    data,
    code,
  };
};

export { formatFieldSource };
