const functionOrStringExp: Function = (
  item: Function | string,
  ...itemArguments
) => (typeof item === 'function' ? item(...itemArguments) : item);

export { functionOrStringExp };
