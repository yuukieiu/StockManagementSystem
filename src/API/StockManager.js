// ------------------------
// ストック品登録
// ------------------------
function registerStocker(user, stockName, stockCount = 0, lastBuyDate = null, lastUnsealDate = null, notifyThreshold = 0, category) {
    const functionName = "ストック品登録";
    writeStartLog(functionName);

    // なにもなければ正常終了
    var returnValue = {
        status  : true,
        message : "success!!"
    }

    try {
        var result = createStocker(user, stockName, stockCount, lastBuyDate, lastUnsealDate, notifyThreshold, category);
    } catch (e) {
        returnValue.status = false;
        switch(e.message) {
            case DB_EMPTY_STOCKERNAME_EXCEPTION:
                returnValue.message = "ストック名が設定されていないため登録できませんでした。";
                break;
            case DB_EMPTY_CATEGORY_EXCEPTION:
                returnValue.message = "分類が設定されていないため登録できませんでした。";
                break;
            case DB_DUPLICATE_STOCKERNAME_EXCEPTION:
                returnValue.message = "ストック名が重複したため登録できませんでした。ストック名：" + stockName;
                break;
            default:
                returnValue.message = "予期せぬエラーによりストック品を登録できませんでした。データ：" + stockName + "," + stockCount + "," + lastBuyDate + "," + lastUnsealDate + "," + notifyThreshold;
                break;
        }
        warnLog(functionName, returnValue.message);
    }

    writeEndLog(functionName);
    return returnValue;
  }

  // ------------------------
  // ストック品一覧取得
  // ------------------------
  function getStockerList() {
    const functionName = "ストック品一覧取得";
    writeStartLog(functionName);

    var stockerList = new Array();
    stockerList = getStockAll();

    writeEndLog(functionName);
    return stockerList;
  }

  // ------------------------
  // 分類一覧取得
  // ------------------------
  function getCategoryList() {
    const functionName = "分類一覧取得";
    writeStartLog(functionName);

    var categoryList = new Array();
    categoryList = getCategoryAll();

    writeEndLog(functionName);
    return categoryList;
  }

  // ------------------------
  // ストック追加
  // ------------------------
  function addStock(user, stockId, stockCount = 0, lastBuyDate) {
    const functionName = "ストック追加";
    writeStartLog(functionName);

    // なにもなければ正常終了
    var returnValue = {
        status  : true,
        message : "success!!"
    }

    try {
        var result = addStockCountById(user, stockId, stockCount, lastBuyDate);
    } catch (e) {
        returnValue.status = false;
        switch(e.message) {
            case DB_EMPTY_STOCK_OBJECT_EXCEPTION:
                returnValue.message = "指定のストックが存在しないためストック追加できませんでした。ストックID：" + stockId;
                break;
            default:
                returnValue.message = "ストックを追加できませんでした。データ：" + stockId + "," + stockCount;
                break;
        }
        warnLog(functionName, returnValue.message);
    }

    writeEndLog(functionName);
    return returnValue;
  }

  // ------------------------
  // ストック使用
  // ------------------------
  function useStock(user, stockId, stockCount = 0, lastUnsealDate) {
    const functionName = "ストック使用";
    writeStartLog(functionName);

    // なにもなければ正常終了
    var returnValue = {
        status  : true,
        message : "success!!"
    }

    try {
        var result = subStockCountById(user, stockId, stockCount, lastUnsealDate);
    } catch (e) {
        returnValue.status = false;
        switch(e.message) {
            case DB_EMPTY_STOCK_OBJECT_EXCEPTION:
                returnValue.message = "指定のストックが存在しないためストック使用できませんでした。";
                break;
            case DB_NOT_ENOUGH_TO_USE_STOCK_EXCEPTION:
                returnValue.message = "ストック数不足のためためストック使用できませんでした。";
                break;
            default:
                returnValue.message = "ストック使用できませんでした。データ：" + stockId + "," + stockCount;
                break;
        }
        warnLog(functionName, returnValue.message);
    }

    writeEndLog(functionName);
    return returnValue;
  }

  // ------------------------
  // ストック品削除
  // ------------------------
  function deleteStocker(user, stockId) {
    const functionName = "ストック品削除";
    writeStartLog(functionName);

    // なにもなければ正常終了
    var returnValue = {
        status  : true,
        message : "success!!"
    }

    try {
        var result = deleteStockById(user, stockId);
    } catch (e) {
        returnValue.status = false;
        switch(e.message) {
            case DB_EMPTY_STOCK_OBJECT_EXCEPTION:
                returnValue.message = "指定のストックが存在しないためストック品削除できませんでした。";
                break;
            default:
                returnValue.message = "ストック品削除できませんでした。データ：" + stockId;
                break;
        }
        warnLog(functionName, returnValue.message);
    }

    writeEndLog(functionName);
    return returnValue;
  }

  // ------------------------
  // ストック閾値チェック(個別)
  // ------------------------
  function checkStockCount(stockerId = "") {
    const functionName = "ストック閾値チェック(個別)";
    writeStartLog(functionName);

    var returnValue = {
        status  : true,
        message : "success!!"
    }
    var stock = getStockById(stockerId);
    if (stock == null) {
      errorlog(functionName,"ストックがないか複数件あります。");
      throw new Error(CANT_CHECK_STOCK_COUNT_EXCEPTION);
    } else {
      var notifyThreshold = getValueInCell(NOTIFY_THRESHOLD,stock.RowIndex);
      var stockCount = getValueInCell(STOCKER_COUNT,stock.RowIndex);
      if (notifyThreshold >= stockCount) {
        returnValue.status = false;
      }
    }

    writeEndLog(functionName);
    return returnValue;
  }

// ------------------------
// ストック情報更新
// ------------------------
function updateStocker(user, targetStockerId = "", newStockerName, newStockerCount, newLastBuyDate, newLastUnsealDate, newCategory, newNotifyThreshold) {
  const functionName = "ストック情報更新";
  writeStartLog(functionName);

  var returnValue = {
    status  : true,
    message : "success!!"
  }

  try {
      var result = updateStockInfoById(user, targetStockerId, newStockerName, newStockerCount, newLastBuyDate, newLastUnsealDate, newCategory, newNotifyThreshold);
  } catch (e) {
    returnValue.status = false;
    switch(e.message) {
        case DB_EMPTY_STOCK_OBJECT_EXCEPTION:
            returnValue.message = "指定のストックが存在しないためストック情報更新できませんでした。";
            break;
        case DB_DUPLICATE_STOCKERNAME_EXCEPTION:
            returnValue.message = "ストック名が重複しているため、更新できませんでした。ストック名：" + newStockerName;
            break;
        default:
            returnValue.message = "ストック情報更新できませんでした。データ：" + targetStockerId;
            break;
    }
    warnLog(functionName, returnValue.message);
  }

  writeEndLog(functionName);
  return returnValue;
}

// ------------------------
// 最終操作履歴取得
// ------------------------
function getLastOperationHistory(targetStockerId) {
  const functionName = "最終操作履歴取得";
  writeStartLog(functionName);


  var history = null;
  try {
    history = getLastOperationHistoryById(targetStockerId);
  } catch(e) {
    switch(e.message) {
      case DB_EMPTY_OPERATION_HISTORY:
        break;
      default:
        throw new Error(e.message);
        break;
    }
  }

  writeEndLog(functionName);
  return history;
}

// ------------------------
// 操作取り消し
// ------------------------
function undoStockerOperation(targetStockerId, targetOperationId) {
  const functionName = "操作取り消し";
  writeStartLog(functionName);

  var returnValue = {
    status  : true,
    message : "success!!"
  }

  try {
    var result = undoStockerOperationById(targetStockerId, targetOperationId);
  } catch (e) {
    returnValue.status = false;
    switch(e.message) {
      case DB_EMPTY_STOCK_OBJECT_EXCEPTION:
        returnValue.message = "指定の履歴が存在しないため操作取り消しできませんでした。";
        break;
      default:
        returnValue.message = "操作取り消しできませんでした。データ：" + targetStockerId;
        break;
    }
  }
  writeEndLog(functionName);
  return returnValue;
}

// ------------------------
// 通知用ストック品一覧作成
// ------------------------
function createNotifyStockList() {
  var notifyStocks = getNotifyStockList();
  // 分類でソート
  notifyStocks.sort(function(a,b) {
    if (a.Category > b.Category) return 1;
    if (a.Category < b.Category) return -1;
    if (a.LastUnsealDate > b.LastUnsealDate) return 1;
    if (a.LastUnsealDate < b.LastUnsealDate) return -1;
    return 0;
  });
  return notifyStocks;
}