const transform = (data, defaults) => {
  if (!data) return [];

  const resp = data.map((item) => {
    if (!item.id) {
      item.id = item.workflowid;
      delete item.workflowid;
    }
    if (defaults) {
      return extend({}, defaults, item);
    }
    return item;
  });
  return resp;
};
