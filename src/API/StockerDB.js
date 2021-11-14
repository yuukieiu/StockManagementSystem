// スプレッドシート
const StockerDB = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("STOCKERDB_SPREADSHEET_ID"));

// シート
const Stocker = StockerDB.getSheetByName("Stocker");

// シート
const Authentication = StockerDB.getSheetByName("Authentication");

// データ開始行
const DATA_START_ROW = 2;

// ★★★Create★★★
// ------------------------
// ストック品追加
// ------------------------
function createStocker(stockName, stockCount = 0, lastBuyDate = null, lastUnsealDate = null, notifyThreshold = 0, category) {
  // なにもなければ成功
  var result = true;

  // ストック名が無い場合はException
  if (!stockName) throw new Error(DB_EMPTY_STOCKERNAME_EXCEPTION);

  // 分類が無い場合はException
  if (!category) throw new Error(DB_EMPTY_CATEGORY_EXCEPTION);

  // 重複チェック
  var target = getStockByName(stockName);
  if (target != null) throw new Error(DB_DUPLICATE_STOCKERNAME_EXCEPTION);

  // 書き込み行取得
  var targetLow = Stocker.getLastRow() + 1;

  // ストックID作成
  var stockerId = Utilities.getUuid();
  while (Stocker.createTextFinder(id).findAll().length > 0) {
    id = Utilities.getUuid();
  }

  // 配列化して1行書き込み
  var value = [id, stockName, stockCount, lastBuyDate, lastUnsealDate, notifyThreshold, category];
  insertRowAtLast(value);

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

// ★★★Update★★★
// ------------------------
// ストック補充(ストック品名)
// ------------------------
function addStockCount(stockName = "", addCount = 0) {
  // なにもなければ成功
  var result = true;

  var target = getStockByName(stockName);
  if (target == null) throw new Error(DB_EMPTY_STOCK_OBJECT_EXCEPTION);

  var currentCount = Stocker.getRange(target.RowIndex, GetItemColumnNum(STOCKER_COUNT)).getValue();
  writeValueInCell(STOCKER_COUNT, target.RowIndex, currentCount + addCount);
  writeValueInCell(LAST_BUY_DATE, target.RowIndex, new Date());

  return result;
}

// ------------------------
// ストック使用(ストック品名)
// ------------------------
function subStockCount(stockName = "", subCount = 0) {
  // なにもなければ成功
  var result = true;

  var target = getStockByName(stockName);
  if (target == null) throw new Error(DB_EMPTY_STOCK_OBJECT_EXCEPTION);

  var currentCount = Stocker.getRange(target.RowIndex, GetItemColumnNum(STOCKER_COUNT)).getValue();
  if (currentCount < subCount) throw new Error(DB_NOT_ENOUGH_TO_USE_STOCK_EXCEPTION);

  writeValueInCell(STOCKER_COUNT, target.RowIndex, currentCount - subCount);
  writeValueInCell(LAST_UNSEAL_DATE, target.RowIndex, new Date());

  return result;
}

// ------------------------
// ストック情報更新
// ------------------------
function updateStockInfo(targetStockerName = "", newStockerName, newCategory, newNotifyThreshold) {
  // new～は変更が無ければそのまま入ってくるので、値の検証はしない

  // なにもなければ成功
  var result = true;

  var target = getStockByName(targetStockerName);
  if (target == null) throw new Error(DB_EMPTY_STOCK_OBJECT_EXCEPTION);

  if (target.StockerName != newStockerName) {
    // 重複チェック
    var target = getStockByName(newStockerName);
    if (target != null) throw new Error(DB_DUPLICATE_STOCKERNAME_EXCEPTION);
    writeValueInCell(STOCKER_NAME, target.RowIndex, newStockerName);
  }
  if (target.Category != newCategory) {
    writeValueInCell(CATEGORY, target.RowIndex, newCategory);
  }
  if (target.NotifyThreshold != newNotifyThreshold) {
    writeValueInCell(NOTIFY_THRESHOLD, target.RowIndex, newNotifyThreshold);
  }

  return result;
}

// ★★★Delete★★★
// ------------------------
// ストック品削除(ストック品名)
// ------------------------
function deleteStockByName(stockerName = "") {
  // なにもなければ成功
  var result = true;

  var target = getStockByName(stockerName);
  if (target == null) throw new Error(DB_EMPTY_STOCK_OBJECT_EXCEPTION);

  Stocker.deleteRow(target.RowIndex);

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