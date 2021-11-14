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