const {
  updateConfigItemAction,
  updateConfigItemWsCommon,
  deleteConfigItemAction,
} = require('../../common/actions');

const updateConfigItem: Function = updateConfigItemAction('FSMS');
const deleteConfigItem: Function = deleteConfigItemAction('FSMS');
const updateConfigItemWs: Function = updateConfigItemWsCommon('FSMS');

export { deleteConfigItem, updateConfigItem, updateConfigItemWs };
