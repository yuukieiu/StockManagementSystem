const TARGET_URL = PropertiesService.getScriptProperties().getProperty("TARGET_URL");

const TARGET_URL_CHECK = TARGET_URL + "?p1=check";

function sendLINE() {
    let messageText = "週次のストック集計が実行されました。\n"
    messageText = messageText + createNotifyMessage();

    // LINEから取得したトークン
    let token = PropertiesService.getScriptProperties().getProperty("LINE_MESSAGING_ACCESS_TOKEN");

    let url = "https://api.line.me/v2/bot/message/broadcast";
    UrlFetchApp.fetch(url, {
      'headers': {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + ACCESS_TOKEN,
      },
      'method': 'post',
      'payload': JSON.stringify({
        'messages': [{
          'type': 'text',
          'text': messageText,
        }],
      }),
      });
   }

function createNotifyMessage() {
  let messageText = ""

  // メッセージ作成
  var today = new Date();
  messageText = messageText + "■" + today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate() + " ストック閾値到達品一覧\n最終開封日：品名：ストック数\n";

  var response = UrlFetchApp.fetch(TARGET_URL_CHECK);
  var stockList = response.getContentText();
  var stockListJson = JSON.parse(stockList);
  var notifyStocks = stockListJson;

  //処理中の分類
  var currentCategory = "";
  // 分類ヘッダーを入れつつ全件出力
  for (var i = 0; i < notifyStocks.length; i++) {
    if (currentCategory != notifyStocks[i].Category) {
      currentCategory = notifyStocks[i].Category;
      messageText = messageText + "\n分類：" + currentCategory + "\n";
    }
    messageText = messageText + "  " + notifyStocks[i].LastUnsealDate + "：" + notifyStocks[i].StockerName + "：" + notifyStocks[i].StockCount + "\n";
  }

  messageText = messageText + "以上"

  return messageText;
}