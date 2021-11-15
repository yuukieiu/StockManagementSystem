// スプレッドシート
const StockerDBforDM = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("STOCKERDB_SPREADSHEET_ID"));

// 履歴シート
const OperationHistory = StockerDBforDM.getSheetByName("OperationHistory");

// 開封間隔データマート
const UnsealInterval = StockerDBforDM.getSheetByName("UnsealIntervalDataMart");

// ------------------------
// 開封間隔データマート作成
// ------------------------
function createUnsealIntervalDataMart() {
  // データマート初期化
  UnsealInterval.getRange(DATA_START_ROW, GetItemColumnNum(STOCKER_ID), OperationHistory.getLastRow()-1, GetItemColumnNum(UNSEAL_INTERVAL)).clear();

  // 全開封履歴取得
  var unsealHistories = getPopHistoryList();

  // データマート作成
  var unsealIntervalDM = calcUnsealInterval(unsealHistories);

  // データマート書き込み
  UnsealInterval.getRange(DATA_START_ROW, GetItemColumnNum(STOCKER_ID), unsealIntervalDM.length, unsealIntervalDM[0].length).setValues(unsealIntervalDM);
}

// ------------------------
// 開封履歴所得
// ------------------------
function getPopHistoryList() {
  var result = [];
  var historyArrays = OperationHistory.getRange(DATA_START_ROW,GetItemColumnNum(STOCKER_ID),OperationHistory.getLastRow()-1,GetItemColumnNum(OPERATION_CATEGORY)).getValues();
  for (var i = 0; i < historyArrays.length; i++) {
    var stock = {
      StockerID         : historyArrays[i][GetItemColumnNum(STOCKER_ID)-1],          // ストックID
      StockerName       : historyArrays[i][GetItemColumnNum(STOCKER_NAME)-1],        // ストック品名
      StockCount        : historyArrays[i][GetItemColumnNum(STOCKER_COUNT)-1],       // ストック数
      LastBuyDate       : Utilities.formatDate(historyArrays[i][GetItemColumnNum(LAST_BUY_DATE)-1],"JST", "yyyy/MM/dd"),       // 最終購入日
      LastUnsealDate    : Utilities.formatDate(historyArrays[i][GetItemColumnNum(LAST_UNSEAL_DATE)-1],"JST", "yyyy/MM/dd"),    // 最終開封日
      NotifyThreshold   : historyArrays[i][GetItemColumnNum(NOTIFY_THRESHOLD)-1],    // 通知閾値
      Category          : historyArrays[i][GetItemColumnNum(CATEGORY)-1],            // 分類
      OperationTimestamp: Utilities.formatDate(historyArrays[i][GetItemColumnNum(OPERATION_TIMESTAMP)-1],"JST", "yyyy/MM/dd"), // 操作日時
      OperationUser     : historyArrays[i][GetItemColumnNum(OPERATION_USER)-1],      // 操作ユーザ
      OperationFunction : historyArrays[i][GetItemColumnNum(OPERATION_FUNCTION)-1],
      RowIndex          : i
    }
    if (stock.OperationFunction == "pop") {
      result.push(stock);
    }
  }
  return result;
}

// ------------------------
// 開封履歴集計
// ------------------------
function calcUnsealInterval(historyArray = []) {
  // ストックID、操作日でソート
  historyArray.sort(function(a,b) {
    if (a.StockerID > b.StockerID) return 1;
    if (a.StockerID < b.StockerID) return -1;
    if (a.OperationTimestamp > b.OperationTimestamp) return 1;
    if (a.OperationTimestamp < b.OperationTimestamp) return -1;
    return 0;
  });

  // 集計結果配列
  var result = [];

  // 処理中のストックID
  var currentStockerID = "";

  // 前回開封日
  var preUnsealDate = "";

  // 開封間隔配列
  var unsealIntervalList = [];

  for (var i = 0;i < historyArray.length; i++) {
    var history = historyArray[i];
    if (currentStockerID != history.StockerID) {
      // ストックIDが変わった
      if (currentStockerID != "") {
        // currentStockerIDが初期値じゃない
        // 集計作業
        var sum = unsealIntervalList.reduce(function (acc, cur) {
          return acc + cur;
        });
        var ave = sum / unsealIntervalList.length;
        result.push([currentStockerID, ave]);

        // 集計後の初期化
        unsealIntervalList = [];
      }

      // 作業中のIDを設定
      currentStockerID = history.StockerID;

      // 最初の開封
      preUnsealDate = history.OperationTimestamp;
    } else {
      // ストックIDが変わっていない
      // 間隔の計算
      var interval = new Date(history.OperationTimestamp).getTime() - new Date(preUnsealDate).getTime();
      // ミリ秒*1000*60秒*60分*24時間
      interval = interval / 1000*60*60*24;
      unsealIntervalList.push(interval);

      preUnsealDate = history.OperationTimestamp;
    }
  }

  return result;
}