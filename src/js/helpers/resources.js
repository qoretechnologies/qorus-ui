// @flow
const selectedType: Function = (collection: Array<Object>): string => {
  if (!collection || collection.length === 0) return 'none';

  if (collection.every((w: Object): boolean => w._selected)) {
    return 'all';
  } else if (collection.some((w: Object): boolean => w._selected)) {
    return 'some';
  }

  return 'none';
};

export {
  selectedType,
};
