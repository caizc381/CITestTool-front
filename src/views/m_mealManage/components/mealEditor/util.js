/*
* 处理单项冲突信息
* 根据项目的冲突报错，组装反馈给用户的提示和下一步操作
* currentId: 当前操作项目
* error: 关系报错信息
* allItemsMap: 所有项目原始数据 Map
* rollbackId: 同组项目中操作前原始被选中的项（当一键解决"被依赖项"冲突时，自动选中该项目）
*/
export const resolveError = (error, currentId, allItemsMap, rollbackId) => {
  let errorFeedbackList = [];
  let errorList = combineError(error);
  for (let type in errorList) {
    errorFeedbackList.push(assembleErrorItem(allItemsMap[currentId], errorList[type], allItemsMap, allItemsMap[rollbackId]));
  }
  return errorFeedbackList;
}

const combineError = (error) => {  //把同一种类型的冲突项合并到一起
  let combinedErrorList = {};
  for (let i=0; i<error.length; i++) {
    if (combinedErrorList[error[i].type]) {
      combinedErrorList[error[i].type].itemIds.push(error[i].itemId);
    } else {
      combinedErrorList[error[i].type] = {
        type: error[i].type,
        itemIds: [error[i].itemId]
      };
    }
  }
  return combinedErrorList;
}

const assembleErrorItem = (item, error, allItemsMap, rollbackItem) => {
  let relateItems = error.itemIds.map(it => allItemsMap[it])
  let errorItem = {
    currItem: item,
    type: error.type,
    itemIds: error.itemIds,
    relateItems: relateItems,
    style: 'warning',
    hide: false
  }
  if (error.type == 'DEPEND') {
    errorItem.desc = item.name + ' 需要依赖以下项目：';
    errorItem.confirmBtnName = '一键全选';
    errorItem.cancelBtnName = '都不选择';
  } else if (error.type == 'DEPENDED') {
    errorItem.desc = item.name + ' 被以下项目依赖：';
    errorItem.confirmBtnName = '都不选择';
    errorItem.cancelBtnName = '一键全选';
    errorItem.rollbackItem = rollbackItem;
  }  else if (error.type == 'FAMILY') {
    errorItem.desc = item.name + ' 与以下项目是父子项,不可以同时选择：';
    errorItem.cancelBtnName = '我知道了';
  } else if (error.type == 'CONFLICT') {
    errorItem.desc = item.name + ' 与以下项目互斥,请去除其中一项：';
    errorItem.cancelBtnName = '我知道了';
  }  else if (error.type == 'COMPOSE') {
    errorItem.desc = item.name + ' 与以下项目是合并项,不可以同时选择：';
    errorItem.cancelBtnName = '我知道了';
  } else if (error.type == 'GROUP') {
    errorItem.desc = item.name + ' 与以下项目为同组项,只能选择其中一个';
    errorItem.cancelBtnName = '我知道了';
  }else if (error.type == 'basicMeal') {
    errorItem.desc = '以下项目在体检中心基础套餐中，必须选择';
    errorItem.cancelBtnName = '我知道了';
  }
  return errorItem;
}
