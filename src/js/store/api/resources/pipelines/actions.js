const {
  updateConfigItemAction,
  updateConfigItemWsCommon,
  deleteConfigItemAction,
} = require('../../common/actions');

const updateConfigItem: Function = updateConfigItemAction('PIPELINES');
const deleteConfigItem: Function = deleteConfigItemAction('PIPELINES');
const updateConfigItemWs: Function = updateConfigItemWsCommon('PIPELINES');

export { deleteConfigItem, updateConfigItem, updateConfigItemWs };
