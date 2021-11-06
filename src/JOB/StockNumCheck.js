// スプレッドシート
const StockerDB = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("STOCKERDB_SPREADSHEET_ID"));

// シート
const Stocker = StockerDB.getSheetByName("Stocker");

// データ開始行
const DATA_START_ROW = 2;

// ------------------------
// 通知対象ストック品リスト取得
// ------------------------
function getNotifyStockList() {
  var result = new Array();
  for (var i = DATA_START_ROW; i <= Stocker.getLastRow(); i++) {
    var stock = {
      StockerName     : getValueInCell(STOCKER_NAME, i),      // ストック品名
      StockCount      : getValueInCell(STOCKER_COUNT, i),     // ストック数
      LastBuyDate     : Utilities.formatDate(getValueInCell(LAST_BUY_DATE, i),"JST", "yyyy/MM/dd"),     // 最終購入日
      LastUnsealDate  : Utilities.formatDate(getValueInCell(LAST_UNSEAL_DATE, i),"JST", "yyyy/MM/dd"),  // 最終開封日
      NotifyThreshold : getValueInCell(NOTIFY_THRESHOLD, i),  // 通知閾値
      Category        : getValueInCell(CATEGORY, i),          // 分類
      RowIndex        : i
    }
    if (stock.StockCount <= stock.NotifyThreshold) {
      result.push(stock);
    }
  }
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