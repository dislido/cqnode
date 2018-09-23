/**
 * 用于整理字段名顺便配合d.ts提供编辑器自动补全支持
 */
module.exports = {
  /**
   * @param {JSON} obj
   * @returns {GroupMsg}
   */
  groupMessage(obj) {
    return {
      subType: obj.sub_type,
      fromQQ: obj.user_id,
      fromGroup: obj.group_id,
      msg: obj.message,
      msgId: obj.message_id,
      font: obj.font,
      rawMessage: obj.raw_message,
    };
  },
};
