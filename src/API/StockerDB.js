// スプレッドシート
const StockerDB = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("STOCKERDB_SPREADSHEET_ID"));

// Stockerシート
const Stocker = StockerDB.getSheetByName("Stocker");

// OperationHistoryシート
const OperationHistory = StockerDB.getSheetByName("OperationHistory");

// シート
const Authentication = StockerDB.getSheetByName("Authentication");

// データ開始行
const DATA_START_ROW = 2;

// ★★★Create★★★
// ------------------------
// ストック品追加
// ------------------------
function createStocker(user, stockName, stockCount = 0, lastBuyDate = null, lastUnsealDate = null, notifyThreshold = 0, category) {
  // なにもなければ成功
  var result = true;

  // ストック名が無い場合はException
  if (!stockName) throw new Error(DB_EMPTY_STOCKERNAME_EXCEPTION);

  // 分類が無い場合はException
  if (!category) throw new Error(DB_EMPTY_CATEGORY_EXCEPTION);

  // 重複チェック
  var target = getStockByName(stockName);
  if (target != null) throw new Error(DB_DUPLICATE_STOCKERNAME_EXCEPTION);

  // ストックID作成
  var stockerId = Utilities.getUuid();
  while (Stocker.createTextFinder(stockerId).findAll().length > 0) {
    stockerId = Utilities.getUuid();
  }

  // 配列化して1行書き込み
  var value = [stockerId, stockName, stockCount, lastBuyDate, lastUnsealDate, notifyThreshold, category];
  insertRowAtLast(value);

  // 操作履歴書き込み
  addOperationHistory(stockerId, stockName, stockCount, lastBuyDate, lastUnsealDate, notifyThreshold, category, user, "create", "", "", "","");
  return result;
}

// ★★★Read★★★
// ------------------------
// ストック情報全取得
// ------------------------
function getStockAll() {
  var result = [];
  var stockerArrays = Stocker.getRange(DATA_START_ROW,GetItemColumnNum(STOCKER_ID),Stocker.getLastRow()-1,GetItemColumnNum(CATEGORY)).getValues();
  for (var i = 0; i < stockerArrays.length; i++) {
    var stock = {
      StockerID       : stockerArrays[i][GetItemColumnNum(STOCKER_ID)-1],        // ストックID
      StockerName     : stockerArrays[i][GetItemColumnNum(STOCKER_NAME)-1],      // ストック品名
      StockCount      : stockerArrays[i][GetItemColumnNum(STOCKER_COUNT)-1],     // ストック数
      LastBuyDate     : Utilities.formatDate(stockerArrays[i][GetItemColumnNum(LAST_BUY_DATE)-1],"JST", "yyyy/MM/dd"),     // 最終購入日
      LastUnsealDate  : Utilities.formatDate(stockerArrays[i][GetItemColumnNum(LAST_UNSEAL_DATE)-1],"JST", "yyyy/MM/dd"),  // 最終開封日
      NotifyThreshold : stockerArrays[i][GetItemColumnNum(NOTIFY_THRESHOLD)-1],  // 通知閾値
      Category        : stockerArrays[i][GetItemColumnNum(CATEGORY)-1],          // 分類
      RowIndex        : i
    }
    result.push(stock);
  }
  return result;
}

// ------------------------
// 操作履歴全取得
// ------------------------
function getOperationHistoryAll() {
  var result = [];
  var historyArrays = OperationHistory.getRange(DATA_START_ROW,GetItemColumnNum(STOCKER_ID),OperationHistory.getLastRow()-1,GetItemColumnNum(OPERATION_CATEGORY)).getValues();
  for (var i = 0; i < historyArrays.length; i++) {
    var stock = {
      StockerID       : historyArrays[i][GetItemColumnNum(STOCKER_ID)-1],        // ストックID
      StockerName     : historyArrays[i][GetItemColumnNum(STOCKER_NAME)-1],      // ストック品名
      StockCount      : historyArrays[i][GetItemColumnNum(STOCKER_COUNT)-1],     // ストック数
      LastBuyDate     : Utilities.formatDate(historyArrays[i][GetItemColumnNum(LAST_BUY_DATE)-1],"JST", "yyyy/MM/dd"),     // 最終購入日
      LastUnsealDate  : Utilities.formatDate(historyArrays[i][GetItemColumnNum(LAST_UNSEAL_DATE)-1],"JST", "yyyy/MM/dd"),  // 最終開封日
      NotifyThreshold : historyArrays[i][GetItemColumnNum(NOTIFY_THRESHOLD)-1],  // 通知閾値
      Category        : historyArrays[i][GetItemColumnNum(CATEGORY)-1],          // 分類
      OperationTimestamp : historyArrays[i][GetItemColumnNum(OPERATION_TIMESTAMP)-1],  // 操作日時
      OperationUser   : historyArrays[i][GetItemColumnNum(OPERATION_USER)-1],    // 操作ユーザ
      OperationFunction : historyArrays[i][GetItemColumnNum(OPERATION_FUNCTION)-1], // 操作
      OperationStockerName : historyArrays[i][GetItemColumnNum(OPERATION_STOCKER_NAME)-1], // ストック名（操作後）
      OperationStockCount : historyArrays[i][GetItemColumnNum(OPERATION_STOCKER_COUNT)-1], // ストック数（操作後）
      OperationNotifyThreshold : historyArrays[i][GetItemColumnNum(OPERATION_NOTIFY_THRESHOLD)-1], // 通知閾値（操作後）
      OperationCategory : historyArrays[i][GetItemColumnNum(OPERATION_CATEGORY)-1], // 分類（操作後）
      OperationID     : historyArrays[i][GetItemColumnNum(OPERATION_ID)-1],      // 操作履歴ID
      RowIndex        : i
    }
    result.push(stock);
  }
  return result;
}

// ------------------------
// 分類一覧取得
// ------------------------
function getCategoryAll() {
  var result = [];
  var categoryArrays = Stocker.getRange(DATA_START_ROW,GetItemColumnNum(CATEGORY),Stocker.getLastRow()-1,GetItemColumnNum(CATEGORY)).getValues();
  for (var i = 0;i < categoryArrays.length; i++) {
    result.push(categoryArrays[i][0]);
  }
  result = result.filter(function (x, i, self) {
    return self.indexOf(x) === i;
  });
  return result;
}

// ------------------------
// ストック品検索(ストック品名)
// ------------------------
function getStockByName(stockerName = "") {
  // ストック品名のみを指定し完全一致で検索
  var stockerNameColumn = Stocker.getRange("B:B");
  var finder = stockerNameColumn.createTextFinder(stockerName)
                .matchEntireCell(true);
  var result = finder.findAll();
  var stock;

  // 引っかからなければnull
  if (result.length == 0) {
    stock = null;
  } else {
    stock = {
      StockerID       : getValueInCell(STOCKER_ID, result[0].getRowIndex()),        // ストックID
      StockerName     : getValueInCell(STOCKER_NAME, result[0].getRowIndex()),      // ストック品名
      StockCount      : getValueInCell(STOCKER_COUNT, result[0].getRowIndex()),     // ストック数
      LastBuyDate     : Utilities.formatDate(getValueInCell(LAST_BUY_DATE, result[0].getRowIndex()),"JST", "yyyy/MM/dd"),     // 最終購入日
      LastUnsealDate  : Utilities.formatDate(getValueInCell(LAST_UNSEAL_DATE, result[0].getRowIndex()),"JST", "yyyy/MM/dd"),  // 最終開封日
      NotifyThreshold : getValueInCell(NOTIFY_THRESHOLD, result[0].getRowIndex()),  // 通知閾値
      Category        : getValueInCell(CATEGORY, result[0].getRowIndex()),          // 分類
      RowIndex        : result[0].getRowIndex()
    }
  }
  return stock;
}

// ------------------------
// ストック品取得(ストックID)
// ------------------------
function getStockById(stockerId = "") {
  // ストックIDのみを指定し完全一致で検索
  var stockerIdColumn = Stocker.getRange("A:A");
  var finder = stockerIdColumn.createTextFinder(stockerId)
                .matchEntireCell(true);
  var result = finder.findAll();
  var stock;

  // 引っかからなければnull
  if (result.length == 0) {
    stock = null;
  } else {
    stock = {
      StockerID       : getValueInCell(STOCKER_ID, result[0].getRowIndex()),        // ストックID
      StockerName     : getValueInCell(STOCKER_NAME, result[0].getRowIndex()),      // ストック品名
      StockCount      : getValueInCell(STOCKER_COUNT, result[0].getRowIndex()),     // ストック数
      LastBuyDate     : Utilities.formatDate(getValueInCell(LAST_BUY_DATE, result[0].getRowIndex()),"JST", "yyyy/MM/dd"),     // 最終購入日
      LastUnsealDate  : Utilities.formatDate(getValueInCell(LAST_UNSEAL_DATE, result[0].getRowIndex()),"JST", "yyyy/MM/dd"),  // 最終開封日
      NotifyThreshold : getValueInCell(NOTIFY_THRESHOLD, result[0].getRowIndex()),  // 通知閾値
      Category        : getValueInCell(CATEGORY, result[0].getRowIndex()),          // 分類
      RowIndex        : result[0].getRowIndex()
    }
  }
  return stock;
}

// ------------------------
// 最終操作履歴取得(ストックID)
// ------------------------
function getLastOperationHistoryById(stockerId = "") {
  var operationHistories = getOperationHistoryAll();
  var operationHistoriesStocker = [];
  for (var i = 0; i < operationHistories.length; i++) {
    if (operationHistories[i].StockerID == stockerId) {
      operationHistoriesStocker.push(operationHistories[i]);
    }
  }

  if (operationHistoriesStocker.length == 0) throw new Error(DB_EMPTY_STOCK_OBJECT_EXCEPTION);

  // 0番目が最新になるようソート
  operationHistoriesStocker.sort(function(a,b) {
    if (a.OperationTimestamp < b.OperationTimestamp) return 1;
    if (a.OperationTimestamp > b.OperationTimestamp) return -1;
    return 0;
  })

  return operationHistoriesStocker[0];
}

// ★★★Update★★★
// ------------------------
// ストック補充(ストックID)
// ------------------------
function addStockCountById(user, stockId = "", addCount = 0, lastBuyDate) {
  // なにもなければ成功
  var result = true;

  var target = getStockById(stockId);
  if (target == null) throw new Error(DB_EMPTY_STOCK_OBJECT_EXCEPTION);

  var currentCount = Stocker.getRange(target.RowIndex, GetItemColumnNum(STOCKER_COUNT)).getValue();
  writeValueInCell(STOCKER_COUNT, target.RowIndex, currentCount + addCount);
  writeValueInCell(LAST_BUY_DATE, target.RowIndex, lastBuyDate);

  // 操作履歴書き込み
  addOperationHistory(target.StockerID, target.StockerName, target.StockCount, target.LastBuyDate, target.LastUnsealDate, target.NotifyThreshold,
      target.Category, user, "push", "", addCount, "","");
  return result;
}

// ------------------------
// ストック使用(ストックID)
// ------------------------
function subStockCountById(user, stockId = "", subCount = 0, lastUnsealDate) {
  // なにもなければ成功
  var result = true;

  var target = getStockById(stockId);
  if (target == null) throw new Error(DB_EMPTY_STOCK_OBJECT_EXCEPTION);

  var currentCount = Stocker.getRange(target.RowIndex, GetItemColumnNum(STOCKER_COUNT)).getValue();
  if (currentCount < subCount) throw new Error(DB_NOT_ENOUGH_TO_USE_STOCK_EXCEPTION);

  writeValueInCell(STOCKER_COUNT, target.RowIndex, currentCount - subCount);
  writeValueInCell(LAST_UNSEAL_DATE, target.RowIndex, lastUnsealDate);

  // 操作履歴書き込み
  addOperationHistory(target.StockerID, target.StockerName, target.StockCount, target.LastBuyDate, target.LastUnsealDate, target.NotifyThreshold,
    target.Category, user, "pop", "", subCount, "","");
  return result;
}

// ------------------------
// ストック情報更新（ストックID）
// ------------------------
function updateStockInfoById(user, targetStockerID = "", newStockerName, newCategory, newNotifyThreshold) {
  // new～は変更が無ければそのまま入ってくるので、値の検証はしない

  // なにもなければ成功
  var result = true;

  var target = getStockById(targetStockerID);
  if (target == null) throw new Error(DB_EMPTY_STOCK_OBJECT_EXCEPTION);

  if (target.StockerName != newStockerName) {
    // 重複チェック
    var check = getStockByName(newStockerName);
    if (check != null) throw new Error(DB_DUPLICATE_STOCKERNAME_EXCEPTION);
    writeValueInCell(STOCKER_NAME, target.RowIndex, newStockerName);
  }
  if (target.Category != newCategory) {
    writeValueInCell(CATEGORY, target.RowIndex, newCategory);
  }
  if (target.NotifyThreshold != newNotifyThreshold) {
    writeValueInCell(NOTIFY_THRESHOLD, target.RowIndex, newNotifyThreshold);
  }

  // 操作履歴書き込み
  addOperationHistory(target.StockerID, target.StockerName, target.StockCount, target.LastBuyDate, target.LastUnsealDate, target.NotifyThreshold,
    target.Category, user, "edit", newStockerName, "", newNotifyThreshold, newCategory);
  return result;
}

// ------------------------
// ストック情報戻し（ストックID）
// ------------------------
function undoStockerOperationById(stockerId = "", operationId) {
  // なにもなければ成功
  var result = true;

  var history = getLastOperationHistoryById(stockerId);
  if (history == null) throw new Error(DB_EMPTY_STOCK_OBJECT_EXCEPTION);
  if (history.OperationID != operationId) throw new Error(DB_EMPTY_STOCK_OBJECT_EXCEPTION);

  var target = getStockById(stockerId);
  if (target == null) throw new Error(DB_EMPTY_STOCK_OBJECT_EXCEPTION);

  writeValueInCell(STOCKER_NAME, target.RowIndex, history.StockerName);
  writeValueInCell(STOCKER_COUNT, target.RowIndex, history.StockCount);
  writeValueInCell(LAST_BUY_DATE, target.RowIndex, history.LastBuyDate);
  writeValueInCell(LAST_UNSEAL_DATE,target.RowIndex, history.LastUnsealDate);
  writeValueInCell(NOTIFY_THRESHOLD, target.RowIndex, history.NotifyThreshold);
  writeValueInCell(CATEGORY, target.RowIndex, history.Category);

  OperationHistory.deleteRow(history.RowIndex);

  return result;
}

// ★★★Delete★★★
// ------------------------
// ストック品削除(ストックID)
// ------------------------
function deleteStockById(user, stockerId = "") {
  // なにもなければ成功
  var result = true;

  var target = getStockById(stockerId);
  if (target == null) throw new Error(DB_EMPTY_STOCK_OBJECT_EXCEPTION);

  Stocker.deleteRow(target.RowIndex);

  // 操作履歴書き込み
  addOperationHistory(target.StockerID, target.StockerName, target.StockCount, target.LastBuyDate, target.LastUnsealDate, target.NotifyThreshold,
    target.Category, user, "delete", "", "", "","");
  return result;
}

// ★★★Utility★★★
// ------------------------
// 指定の項目、指定の行へ値を書き込み
// ------------------------
function writeValueInCell(itemName, row, value) {
  Stocker.getRange(row, GetItemColumnNum(itemName)).setValue(value);
}

// ------------------------
// 指定の項目、指定の行の値を取得
// ------------------------
function getValueInCell(itemName, row) {
  return Stocker.getRange(row, GetItemColumnNum(itemName)).getValue();
}

// ------------------------
// 1行書き込み（最終行）
// ------------------------
function insertRowAtLast(value = []) {
  Stocker.appendRow(value);
}

// ------------------------
// 履歴書き込み
// ------------------------
function addOperationHistory(stockerId, stockerName, stockCount, lastBuyDate, lastUnsealDate, notifyThreshold, category, operationUser, operationFunction,
    operationStockerName, operationStockCount, operationNotifyThreshold, operationCategory) {
  var operationTimestamp = new Date();
  var operationId = stockerId + Utilities.getUuid();
  while (OperationHistory.createTextFinder(operationId).findAll().length > 0) {
    operationId = stockerId + Utilities.getUuid();
  }
  OperationHistory.appendRow([stockerId, stockerName, stockCount, lastBuyDate, lastUnsealDate, notifyThreshold, category, operationTimestamp, operationUser, operationFunction,
    operationStockerName, operationStockCount, operationNotifyThreshold, operationCategory, operationId]);
}