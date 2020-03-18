
export default (oldData, newList) => {
  //最小渲染下标
  const beginItemInNewList = newList[0];
  const endItemInNewList = newList[newList.length - 1];
  const oldList = oldData.list;

  if (oldData.list.length) {
    const unusedPositionInOldList:number[] = [];
    // 将oldData中不再使用的位置记录下来，放到unusedPositionInOldList中，以便往里面插入新数据
    // console.log({ newData })
    oldList.forEach((oldItem, position) => {
      if (oldItem.__index__ > endItemInNewList.__index__ || oldItem.__index__ < beginItemInNewList.__index__) {
        //过滤出不要的index
        unusedPositionInOldList.push(position);
      }
    });
    const addNewItemIntoOldList = (positionInNewListForInsertingIntoOldList) => {
      const itemInNewListForInsertingIntoOldList = newList[positionInNewListForInsertingIntoOldList];
      if (unusedPositionInOldList.length) {
        const index = unusedPositionInOldList.pop();
        //弹出下标
        oldList.splice(index, 1, itemInNewListForInsertingIntoOldList);
        //替换
      } else {
        oldList.push(itemInNewListForInsertingIntoOldList);
      }
    }

    var positionInNewListForInsertingIntoOldList = 0;
    for (let i = beginItemInNewList.__index__; i < oldData.beginIndex; i++) {
      addNewItemIntoOldList(positionInNewListForInsertingIntoOldList++);
    }
    positionInNewListForInsertingIntoOldList = newList.length - 1;
    for (let i = oldData.endIndex + 1; i <= endItemInNewList.__index__; i++) {
      addNewItemIntoOldList(positionInNewListForInsertingIntoOldList--);
    }
    newList = oldList
    // console.log({newList, oldList})

  }

  return {
    list: newList,
    beginIndex: beginItemInNewList.__index__,
    endIndex: endItemInNewList.__index__,
  }
}
